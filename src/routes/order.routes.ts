import { Router } from 'express';
import { OrderController } from '@/controllers/order.controller';
import { validate } from '@/utils/validate';
import {
	createOrderSchema,
	updateOrderStatusSchema,
} from '@/schemas/order.schema';

const orderRouter = Router();
const orderController = new OrderController();

// Crear un nuevo pedido
orderRouter.post(
	'/',
	validate(createOrderSchema),
	(req, res) => orderController.createOrder(req, res)
);

// Obtener pedido por ID
orderRouter.get(
	'/:id',
	(req, res) => orderController.getOrderById(req, res)
);

// Obtener pedidos por ID de usuario
orderRouter.get(
	'/user/:userId',
	(req, res) => orderController.getOrdersByUserId(req, res)
);

// Actualizar estado del pedido
orderRouter.put(
	'/:id/status',
	validate(updateOrderStatusSchema),
	(req, res) => orderController.updateOrderStatus(req, res)
);

// Cancelar pedido
orderRouter.put(
	'/:id/cancel',
	(req, res) => orderController.cancelOrder(req, res)
);

// Obtener todos los pedidos
orderRouter.get(
	'/',
	(req, res) => orderController.getAllOrders(req, res)
);

export default orderRouter;
