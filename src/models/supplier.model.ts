import { Collection, ObjectId } from 'mongodb';
import { getDb } from '@/utils/db';

export interface Supplier {
	_id?: ObjectId | string;
	name: string;
	contactInfo: {
		email: string;
		phone: string;
		address: string;
	};
	productsSupplied?: (ObjectId | string)[];
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export class SupplierModel {
	private collectionName = 'suppliers';

	private async getCollection(): Promise<Collection<Supplier>> {
		const db = await getDb();
		return db.collection<Supplier>(this.collectionName);
	}

	async createSupplier(supplier: Supplier): Promise<Supplier> {
		supplier.createdAt = new Date();
		supplier.updatedAt = new Date();
		supplier.isActive = true;
		const collection = await this.getCollection();
		const result = await collection.insertOne(supplier);
		return { ...supplier, _id: result.insertedId };
	}

	async getSupplierById(supplierId: string): Promise<Supplier | null> {
		const collection = await this.getCollection();
		return collection.findOne({ _id: new ObjectId(supplierId), isActive: true });
	}

	async updateSupplier(supplierId: string, updateData: Partial<Supplier>): Promise<void> {
		updateData.updatedAt = new Date();
		const collection = await this.getCollection();
		await collection.updateOne({ _id: new ObjectId(supplierId) }, { $set: updateData });
	}

	async deactivateSupplier(supplierId: string): Promise<void> {
		const collection = await this.getCollection();
		await collection.updateOne(
			{ _id: new ObjectId(supplierId) },
			{ $set: { isActive: false, updatedAt: new Date() } }
		);
	}

	async getAllSuppliers(): Promise<Supplier[]> {
		const collection = await this.getCollection();
		return collection.find({ isActive: true }).toArray();
	}
}
