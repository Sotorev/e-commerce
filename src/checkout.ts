import { Request, Response } from "express";

const enviroment = Bun.env.ENVIROMENT;
const client_id = Bun.env.CLIENT_ID;
const client_secret = Bun.env.CLIENT_SECRET;

const endpoint_url = enviroment === 'sandbox' ? 'https://api.sandbox.paypal.com' : 'https://api.sandbox.paypal.com';

/**
 * Creates an order and returns it as a JSON response.
 * @function
 * @name createOrder
 * @memberof module:routes
 * @param {object} req - The HTTP request object.
 * @param {object} req.body - The request body containing the order information.
 * @param {string} req.body.intent - The intent of the order.
 * @param {object} res - The HTTP response object.
 * @returns {object} The created order as a JSON response.
 * @throws {Error} If there is an error creating the order.
 */
export function createOrder(req: Request, res: Response) {
	get_access_token()
		.then(access_token => {
			let order_data_json = {
				'intent': req.body.intent.toUpperCase(),
				'purchase_units': [{
					'amount': {
						'currency_code': 'USD',
						'value': '100.00'
					}
				}]
			};
			const data = JSON.stringify(order_data_json)

			fetch(endpoint_url + '/v2/checkout/orders', { //https://developer.paypal.com/docs/api/orders/v2/#orders_create
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
				}) //Send minimal data to client
		})
		.catch(err => {
			console.log(err);
			res.status(500).send(err)
		})
}

/**
 * Completes an order and returns it as a JSON response.
 * @function
 * @name completeOrder
 * @memberof module:routes
 * @param {object} req - The HTTP request object.
 * @param {object} req.body - The request body containing the order ID and intent.
 * @param {string} req.body.order_id - The ID of the order to complete.
 * @param {string} req.body.intent - The intent of the order.
 * @param {object} res - The HTTP response object.
 * @returns {object} The completed order as a JSON response.
 * @throws {Error} If there is an error completing the order.
 */
export function completeOrder(req: Request, res: Response) {
	get_access_token()
		.then(access_token => {
			fetch(endpoint_url + '/v2/checkout/orders/' + req.body.order_id + '/' + req.body.intent, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${access_token}`
				}
			})
				.then(res => res.json())
				.then(json => {
					console.log(json);
					res.send(json);
				}) //Send minimal data to client
		})
		.catch(err => {
			console.log(err);
			res.status(500).send(err)
		})
}

//PayPal Developer YouTube Video:
//How to Retrieve an API Access Token (Node.js)
//https://www.youtube.com/watch?v=HOkkbGSxmp4
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
