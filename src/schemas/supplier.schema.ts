import { z } from 'zod';

export const contactInfoSchema = z.object({
	email: z.string().email({ message: 'Correo electrónico inválido' }),
	phone: z.string().nonempty({ message: 'El teléfono es requerido' }),
	address: z.string().nonempty({ message: 'La dirección es requerida' }),
});

export const createSupplierSchema = z.object({
	name: z.string().nonempty({ message: 'El nombre es requerido' }),
	contactInfo: contactInfoSchema,
	productsSupplied: z.array(z.string()).optional(),
});

export const updateSupplierSchema = z.object({
	name: z.string().optional(),
	contactInfo: contactInfoSchema.partial().optional(),
	productsSupplied: z.array(z.string()).optional(),
});
