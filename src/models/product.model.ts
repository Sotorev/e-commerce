// src/models/product.model.ts
import { Collection, ObjectId } from 'mongodb';
import { getDb } from '@/utils/db';

export interface Product {
	_id?: ObjectId | string;
	name: string;
	description: string;
	images: string[];
	videos: string[];
	specifications: Record<string, any>;
	price: number;
	inventory: number;
	variations: Array<{ size?: string, color?: string, [key: string]: any }>;
	category: string;
	tags: string[];
	createdAt: Date;
	updatedAt: Date;
}

export class ProductModel {
	private collectionName = 'products';

	private async getCollection(): Promise<Collection<Product>> {
		const db = await getDb();
		return db.collection<Product>(this.collectionName);
	}

	async createProduct(product: Product): Promise<Product> {
		const collection = await this.getCollection();
		const result = await collection.insertOne(product);
		return { ...product, _id: result.insertedId };
	}

	async getProductById(id: string): Promise<Product | null> {
		const collection = await this.getCollection();
		return collection.findOne({ _id: new ObjectId(id) });
	}

	async getProducts(): Promise<Product[]> {
		const collection = await this.getCollection();
		return collection.find({}).toArray();
	}

	async updateProduct(id: string, product: Partial<Product>): Promise<void> {
		const collection = await this.getCollection();
		await collection.updateOne({ _id: new ObjectId(id) }, { $set: product });
	}

	async deleteProduct(id: string): Promise<void> {
		const collection = await this.getCollection();
		await collection.deleteOne({ _id: new ObjectId(id) });
	}
}
