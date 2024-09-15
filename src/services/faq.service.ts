import { FaqModel, Faq } from '@/models/faq.model';
import { ObjectId } from 'mongodb';

export class FaqService {
	private faqModel: FaqModel;

	constructor() {
		this.faqModel = new FaqModel();
	}

	async getAllFaqs(): Promise<Faq[]> {
		return this.faqModel.getAllFaqs();
	}

	async createFaq(faqData: Faq): Promise<Faq> {
		return this.faqModel.createFaq(faqData);
	}

	async updateFaq(faqId: ObjectId | string, faqData: Partial<Faq>): Promise<void> {
		await this.faqModel.updateFaq(faqId, faqData);
	}

	async deleteFaq(faqId: ObjectId | string): Promise<void> {
		await this.faqModel.deleteFaq(faqId);
	}
}
