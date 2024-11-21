import { Request, Response } from "express";

// Tus credenciales de sandbox
const client_id = "ARRA3T3Mmd2KujxvoCVGbtp2QrFaD1_ofYR5EU1nzSPCQ6KVpVcjIaIJGPdkXok17A7piny14eOH-rt0";
const client_secret = "ENSixxFPT5rHxv_eZtTOd-xYdLUYKeugzcHj0XDKBV7EpGgQAcseq7UtSKaAfwoes1RFgDogRGAMJ-Q6";
const endpoint_url = 'https://api.sandbox.paypal.com'; // Forzamos el uso de sandbox

export function createOrder(req: Request, res: Response) {
    get_access_token()
        .then(access_token => {
            let order_data_json = {
                'intent': 'CAPTURE', // Cambiado a CAPTURE por defecto
                'purchase_units': [{
                    'amount': {
                        'currency_code': 'USD',
                        'value': '100.00'
                    },
                    'description': 'Compra en Embryo Shop'
                }]
            };
            const data = JSON.stringify(order_data_json)

            fetch(endpoint_url + '/v2/checkout/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                },
                body: data
            })
                .then(res => res.json())
                .then(json => {
                    res.send(json);
                })
        })
        .catch(err => {
            console.error('Error creating order:', err);
            res.status(500).send(err)
        })
}

export function completeOrder(req: Request, res: Response) {
    get_access_token()
        .then(access_token => {
            fetch(endpoint_url + '/v2/checkout/orders/' + req.body.order_id + '/capture', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            })
                .then(res => res.json())
                .then(json => {
                    console.log('Order completed:', json);
                    res.send(json);
                })
        })
        .catch(err => {
            console.error('Error completing order:', err);
            res.status(500).send(err)
        })
}

function get_access_token() {
    const auth = `${client_id}:${client_secret}`
    const data = 'grant_type=client_credentials'
    return fetch(endpoint_url + '/v1/oauth2/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(auth).toString('base64')}`
        },
        body: data
    })
        .then(res => res.json())
        .then(json => {
            return json.access_token;
        })
}