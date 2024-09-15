import { Request, Response } from 'express';
import { CartService } from '@/services/cart.service';
import { CustomRequest } from '@/utils/auth';

export class CartController {
	private cartService: CartService;

	constructor() {
		this.cartService = new CartService();
	}

	async getCart(req: CustomRequest, res: Response): Promise<void> {
		try {
			const userId = req.user._id;
			const cart = await this.cartService.getCart(userId);
			res.status(200).json(cart);
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}

	async addItem(req: CustomRequest, res: Response): Promise<void> {
		const { productId, quantity, variation } = req.body;
		try {
			const userId = req.user._id;
			await this.cartService.addItemToCart(userId, productId, quantity, variation);
			res.status(200).json({ message: 'Item added to cart successfully' });
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}

	async removeItem(req: CustomRequest, res: Response): Promise<void> {
		const { productId, variation } = req.body;
		try {
			const userId = req.user._id;
			await this.cartService.removeItemFromCart(userId, productId, variation);
			res.status(200).json({ message: 'Item removed from cart successfully' });
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}

	async updateItem(req: CustomRequest, res: Response): Promise<void> {
		const { productId, quantity, variation } = req.body;
		try {
			const userId = req.user._id;
			await this.cartService.updateItemQuantity(userId, productId, quantity, variation);
			res.status(200).json({ message: 'Cart updated successfully' });
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}
}
