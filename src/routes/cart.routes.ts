import { Router } from 'express';
import { CartController } from '@/controllers/cart.controller';
import { validate } from '@/utils/validate';
import {
	addItemSchema,
	removeItemSchema,
	updateItemSchema,
} from '@/schemas/cart.schema';
// import { authenticate } from '@/middlewares/auth.middleware';

const cartRouter = Router();
const cartController = new CartController();

// Get cart
cartRouter.get('/cart/:userId',
	// authenticate,
	(req, res) => cartController.getCart(req, res));

// Add item to cart
cartRouter.post(
	'/cart/add/:userId',
	// authenticate,
	validate(addItemSchema),
	(req, res) => cartController.addItem(req, res)
);

// Remove item from cart
cartRouter.post(
	'/cart/remove/:userId',
	// authenticate,
	validate(removeItemSchema),
	(req, res) => cartController.removeItem(req, res)
);

// Update item quantity in cart
cartRouter.post(
	'/cart/update/:userId',
	// authenticate,
	validate(updateItemSchema),
	(req, res) => cartController.updateItem(req, res)
);

export default cartRouter;
