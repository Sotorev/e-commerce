import { Collection, ObjectId } from 'mongodb';
import { getDb } from '@/utils/db';

export interface OrderItem {
	productId: ObjectId | string;
	quantity: number;
	price: number; // Precio al momento del pedido
	variation?: { [key: string]: any };
}

export interface ShippingAddress {
	street: string;
	city: string;
	state: string;
	postalCode: string;
	country: string;
}

export type OrderStatus = 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado' | 'devuelto';

export interface Order {
	_id?: ObjectId | string;
	userId: ObjectId | string;
	items: OrderItem[];
	totalAmount: number;
	status: OrderStatus;
	shippingAddress: ShippingAddress;
	paymentMethod: string;
	trackingNumber?: string;
	createdAt: Date;
	updatedAt: Date;
	isActive: boolean;
}

export class OrderModel {
	private collectionName = 'orders';

	private async getCollection(): Promise<Collection<Order>> {
		const db = await getDb();
		return db.collection<Order>(this.collectionName);
	}

	async createOrder(order: Order): Promise<Order> {
		order.createdAt = new Date();
		order.updatedAt = new Date();
		order.isActive = true;
		const collection = await this.getCollection();
		const result = await collection.insertOne(order);
		return { ...order, _id: result.insertedId };
	}

	async getOrderById(orderId: string): Promise<Order | null> {
		const collection = await this.getCollection();
		return collection.findOne({ _id: new ObjectId(orderId), isActive: true });
	}

	async getOrdersByUserId(userId: string): Promise<Order[]> {
		const collection = await this.getCollection();
		return collection.find({ userId: new ObjectId(userId), isActive: true }).toArray();
	}

	async updateOrder(orderId: string, updateData: Partial<Order>): Promise<void> {
		updateData.updatedAt = new Date();
		const collection = await this.getCollection();
		await collection.updateOne({ _id: new ObjectId(orderId) }, { $set: updateData });
	}

	async cancelOrder(orderId: string): Promise<void> {
		const collection = await this.getCollection();
		await collection.updateOne(
			{ _id: new ObjectId(orderId) },
			{ $set: { status: 'cancelado', updatedAt: new Date() } }
		);
	}

	async getAllOrders(): Promise<Order[]> {
		const collection = await this.getCollection();
		return collection.find({ isActive: true }).toArray();
	}
}
