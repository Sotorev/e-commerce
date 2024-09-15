import { Request, Response } from 'express';
import { FaqService } from '@/services/faq.service';

export class FaqController {
	private faqService: FaqService;

	constructor() {
		this.faqService = new FaqService();
	}

	async getAllFaqs(req: Request, res: Response): Promise<void> {
		try {
			const faqs = await this.faqService.getAllFaqs();
			res.status(200).json(faqs);
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}

	async createFaq(req: Request, res: Response): Promise<void> {
		try {
			const faqData = req.body;
			const newFaq = await this.faqService.createFaq(faqData);
			res.status(201).json({ message: 'FAQ created successfully', faq: newFaq });
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}

	async updateFaq(req: Request, res: Response): Promise<void> {
		try {
			const faqId = req.params.id;
			const faqData = req.body;
			await this.faqService.updateFaq(faqId, faqData);
			res.status(200).json({ message: 'FAQ updated successfully' });
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}

	async deleteFaq(req: Request, res: Response): Promise<void> {
		try {
			const faqId = req.params.id;
			await this.faqService.deleteFaq(faqId);
			res.status(200).json({ message: 'FAQ deleted successfully' });
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}
}
