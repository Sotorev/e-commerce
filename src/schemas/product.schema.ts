// src/schemas/product.schema.ts
import { z } from 'zod';

export const productSchema = z.object({
	name: z.string().min(1, 'Product name is required'),
	description: z.string().min(1, 'Product description is required'),
	images: z.array(z.string().url()).optional(),
	videos: z.array(z.string().url()).optional(),
	specifications: z.record(z.any()).optional(),
	price: z.number().min(0, 'Price must be greater than or equal to 0'),
	inventory: z.number().min(0, 'Inventory must be greater than or equal to 0'),
	variations: z
		.array(
			z.object({
				size: z.string().optional(),
				color: z.string().optional(),
			})
		)
		.optional(),
	category: z.string().min(1, 'Category is required'),
	tags: z.array(z.string()).optional(),
});

export const updateProductSchema = productSchema.partial();
