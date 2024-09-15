import { Collection, ObjectId } from 'mongodb';
import { getDb } from '@/utils/db';

export interface Faq {
	_id?: ObjectId | string;
	question: string;
	answer: string;
	category: string;
	createdAt: Date;
	updatedAt: Date;
}

export class FaqModel {
	private collectionName = 'faqs';

	private async getCollection(): Promise<Collection<Faq>> {
		const db = await getDb();
		return db.collection<Faq>(this.collectionName);
	}

	async getAllFaqs(): Promise<Faq[]> {
		const faqs = await this.getCollection();
		return faqs.find().toArray();
	}

	async getFaqById(faqId: ObjectId | string): Promise<Faq | null> {
		const faqs = await this.getCollection();
		return faqs.findOne({ _id: new ObjectId(faqId) });
	}

	async createFaq(faq: Faq): Promise<Faq> {
		const faqs = await this.getCollection();
		const result = await faqs.insertOne({
			...faq,
			createdAt: new Date(),
			updatedAt: new Date(),
		});
		return { ...faq, _id: result.insertedId };
	}

	async updateFaq(faqId: ObjectId | string, faq: Partial<Faq>): Promise<void> {
		const faqs = await this.getCollection();
		await faqs.updateOne(
			{ _id: new ObjectId(faqId) },
			{ $set: { ...faq, updatedAt: new Date() } }
		);
	}

	async deleteFaq(faqId: ObjectId | string): Promise<void> {
		const faqs = await this.getCollection();
		await faqs.deleteOne({ _id: new ObjectId(faqId) });
	}
}
