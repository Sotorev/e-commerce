import { z } from 'zod';

export const addItemSchema = z.object({
	productId: z.string().nonempty(),
	quantity: z.number().int().positive(),
	variation: z.optional(z.record(z.any())),
});

export const removeItemSchema = z.object({
	productId: z.string().nonempty(),
	variation: z.optional(z.record(z.any())),
});

export const updateItemSchema = z.object({
	productId: z.string().nonempty(),
	quantity: z.number().int().positive(),
	variation: z.optional(z.record(z.any())),
});
