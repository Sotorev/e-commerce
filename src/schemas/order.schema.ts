import { z } from 'zod';

export const orderItemSchema = z.object({
	productId: z.string().nonempty({ message: 'El ID del producto es requerido' }),
	quantity: z.number().int().positive({ message: 'La cantidad debe ser un entero positivo' }),
	variation: z.record(z.any()).optional(),
});

export const shippingAddressSchema = z.object({
	street: z.string().nonempty({ message: 'La calle es requerida' }),
	city: z.string().nonempty({ message: 'La ciudad es requerida' }),
	state: z.string().nonempty({ message: 'El estado es requerido' }),
	postalCode: z.string().nonempty({ message: 'El código postal es requerido' }),
	country: z.string().nonempty({ message: 'El país es requerido' }),
});

export const createOrderSchema = z.object({
	userId: z.string().nonempty({ message: 'El ID del usuario es requerido' }),
	items: z.array(orderItemSchema).nonempty({ message: 'Se requiere al menos un artículo' }),
	shippingAddress: shippingAddressSchema,
	paymentMethod: z.string().nonempty({ message: 'El método de pago es requerido' }),
});

export const updateOrderStatusSchema = z.object({
	status: z.enum(['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado', 'devuelto'], {
		message: 'Estado de pedido inválido',
	}),
});
