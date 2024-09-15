import { z } from 'zod';

export const createFaqSchema = z.object({
	question: z.string().nonempty('Question is required'),
	answer: z.string().nonempty('Answer is required'),
	category: z.string().nonempty('Category is required'),
});

export const updateFaqSchema = z.object({
	question: z.string().optional(),
	answer: z.string().optional(),
	category: z.string().optional(),
});
