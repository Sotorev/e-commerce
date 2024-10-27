import { Request, Response } from 'express';
import { OrderService } from '@/services/order.service';
import { createOrderSchema } from '@/schemas/order.schema';

export class OrderController {
	private orderService: OrderService;

	constructor() {
		this.orderService = new OrderService();
	}

	async createOrder(req: Request, res: Response): Promise<void> {
		// Validate the request body with zod
		const { error, data } = createOrderSchema.safeParse(req.body);

		if (error) {
			res.status(400).json({ error: error.errors });
			return;
		}

		try {
			const orderData = data;
			const order = await this.orderService.createOrder(orderData);
			res.status(201).json({ message: 'Pedido creado con éxito', order });
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}

	async getOrderById(req: Request, res: Response): Promise<void> {
		try {
			const orderId = req.params.id;
			const order = await this.orderService.getOrderById(orderId);
			res.status(200).json({ order });
		} catch (error: any) {
			res.status(404).json({ error: error.message });
		}
	}

	async getOrdersByUserId(req: Request, res: Response): Promise<void> {
		try {
			const userId = req.params.userId;
			const orders = await this.orderService.getOrdersByUserId(userId);
			res.status(200).json({ orders });
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}

	async updateOrderStatus(req: Request, res: Response): Promise<void> {
		try {
			const orderId = req.params.id;
			const { status } = req.body;
			await this.orderService.updateOrderStatus(orderId, status);
			res.status(200).json({ message: 'Estado del pedido actualizado' });
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}

	async getAllOrders(req: Request, res: Response): Promise<void> {
		try {
			const orders = await this.orderService.getAllOrders();
			res.status(200).json({ orders });
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}

	async cancelOrder(req: Request, res: Response): Promise<void> {
		try {
			const orderId = req.params.id;
			await this.orderService.cancelOrder(orderId);
			res.status(200).json({ message: 'Pedido cancelado con éxito' });
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}
}
