import { Collection, ObjectId } from 'mongodb';
import { getDb } from '@/utils/db';

export interface CartItem {
	productId: ObjectId | string;
	quantity: number;
	variation?: { [key: string]: any };
}

export interface Cart {
	_id?: ObjectId | string;
	userId?: ObjectId | string; // Optional for anonymous users
	items: CartItem[];
	createdAt: Date;
	updatedAt: Date;
	isActive: boolean;
}

export class CartModel {
	private collectionName = 'carts';

	private async getCollection(): Promise<Collection<Cart>> {
		const db = await getDb();
		return db.collection<Cart>(this.collectionName);
	}

	async createCart(cart: Cart): Promise<Cart> {
		cart.isActive = true;
		cart.createdAt = new Date();
		cart.updatedAt = new Date();
		const carts = await this.getCollection();
		const result = await carts.insertOne(cart);
		return { ...cart, _id: result.insertedId };
	}

	async getCartByUserId(userId: ObjectId | string): Promise<Cart | null> {
		const carts = await this.getCollection();
		return carts.findOne({ userId: new ObjectId(userId) });
	}

	async updateCart(userId: ObjectId | string, cart: Partial<Cart>): Promise<void> {
		const carts = await this.getCollection();
		await carts.updateOne(
			{ userId: new ObjectId(userId) },
			{ $set: { ...cart, updatedAt: new Date() } }
		);
	}

	async deleteCart(userId: ObjectId | string): Promise<void> {
		const carts = await this.getCollection();
		await carts.updateOne({ userId: new ObjectId(userId) }, { $set: { isActive: false } });
	}
}
