import { Router } from 'express';
import { FaqController } from '@/controllers/faq.controller';
import { validate } from '@/utils/validate';
import { authenticate } from '@/utils/auth';
import { authorize } from '@/middlewares/authorize.middlewares';
import { createFaqSchema, updateFaqSchema } from '@/schemas/faq.schema';

const faqRouter = Router();
const faqController = new FaqController();

// Public route to get all FAQs
faqRouter.get('/faqs', (req, res) => faqController.getAllFaqs(req, res));

// Admin routes
faqRouter.post(
	'/faqs',
	authenticate,
	authorize('admin'),
	validate(createFaqSchema),
	(req, res) => faqController.createFaq(req, res)
);

faqRouter.put(
	'/faqs/:id',
	authenticate,
	authorize('admin'),
	validate(updateFaqSchema),
	(req, res) => faqController.updateFaq(req, res)
);

faqRouter.delete(
	'/faqs/:id',
	authenticate,
	authorize('admin'),
	(req, res) => faqController.deleteFaq(req, res)
);

export default faqRouter;
