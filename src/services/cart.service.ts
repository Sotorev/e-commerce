import { CartModel, CartItem, Cart } from '@/models/cart.model';
import { ProductModel } from '@/models/product.model';
import { ObjectId } from 'mongodb';


export class CartService {
	private cartModel: CartModel;
	private productModel: ProductModel;

	constructor() {
		this.cartModel = new CartModel();
		this.productModel = new ProductModel();
	}

	async getCart(userId: ObjectId | string): Promise<Cart> {
		let cart = await this.cartModel.getCartByUserId(userId);
		if (!cart) {
			cart = await this.cartModel.createCart({
				userId: new ObjectId(userId),
				items: [],
				createdAt: new Date(),
				updatedAt: new Date(),
			});
		}
		return cart;
	}

	async addItemToCart(
		userId: ObjectId | string,
		productId: ObjectId | string,
		quantity: number,
		variation?: { [key: string]: any }
	): Promise<void> {
		const cart = await this.getCart(userId);
		const product = await this.productModel.getProductById(productId.toString());
		if (!product) {
			throw new Error('Product not found');
		}

		const existingItemIndex = cart.items.findIndex(
			(item) =>
				item.productId.toString() === productId.toString() &&
				JSON.stringify(item.variation) === JSON.stringify(variation)
		);

		if (existingItemIndex !== -1) {
			cart.items[existingItemIndex].quantity += quantity;
		} else {
			cart.items.push({
				productId: new ObjectId(productId),
				quantity,
				variation,
			});
		}

		cart.updatedAt = new Date();
		await this.cartModel.updateCart(userId, cart);
	}

	async removeItemFromCart(
		userId: ObjectId | string,
		productId: ObjectId | string,
		variation?: { [key: string]: any }
	): Promise<void> {
		const cart = await this.getCart(userId);

		cart.items = cart.items.filter(
			(item) =>
				!(
					item.productId.toString() === productId.toString() &&
					JSON.stringify(item.variation) === JSON.stringify(variation)
				)
		);

		cart.updatedAt = new Date();
		await this.cartModel.updateCart(userId, cart);
	}

	async updateItemQuantity(
		userId: ObjectId | string,
		productId: ObjectId | string,
		quantity: number,
		variation?: { [key: string]: any }
	): Promise<void> {
		const cart = await this.getCart(userId);

		const existingItem = cart.items.find(
			(item) =>
				item.productId.toString() === productId.toString() &&
				JSON.stringify(item.variation) === JSON.stringify(variation)
		);

		if (existingItem) {
			existingItem.quantity = quantity;
		} else {
			throw new Error('Item not found in cart');
		}

		cart.updatedAt = new Date();
		await this.cartModel.updateCart(userId, cart);
	}

	async calculateTotalPrice(userId: ObjectId | string): Promise<number> {
		const cart = await this.getCart(userId);
		let totalPrice = 0;

		for (const item of cart.items) {
			const product = await this.productModel.getProductById(item.productId.toString());
			if (product) {
				totalPrice += product.price * item.quantity;
			}
		}

		return totalPrice;
	}
}
