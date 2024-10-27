import { OrderModel, Order, OrderStatus, OrderItem, ShippingAddress } from '@/models/order.model';
import { ObjectId } from 'mongodb';
import { ProductModel } from '@/models/product.model';
import { UserModel } from '@/models/user.model';

export class OrderService {
	private orderModel: OrderModel;
	private productModel: ProductModel;
	private userModel: UserModel;

	constructor() {
		this.orderModel = new OrderModel();
		this.productModel = new ProductModel();
		this.userModel = new UserModel();
	}

	async createOrder(orderData: Partial<Order>): Promise<Order> {
		// Validar usuario
		const userId = new ObjectId(orderData.userId);
		const user = await this.userModel.findUserById(userId);
		if (!user) {
			throw new Error('Usuario no encontrado');
		}

		// Validar productos y calcular el monto total
		if (!orderData.items) {
			throw new Error('No se proporcionaron artículos para el pedido');
		}
		const items: OrderItem[] = [];
		let totalAmount = 0;
		for (const item of orderData.items) {
			const productId = new ObjectId(item.productId);
			const product = await this.productModel.getProductById(productId.toString());
			if (!product || !product.isActive) {
				throw new Error(`Producto con ID ${item.productId} no encontrado o inactivo`);
			}
			if (product.inventory < item.quantity) {
				throw new Error(`Inventario insuficiente para el producto ${product.name}`);
			}

			// Obtener precio del producto
			const price = product.price;

			// Disminuir inventario del producto
			if (product._id) {
				await this.productModel.updateProduct(product._id.toString(), { inventory: product.inventory - item.quantity });
			} else {
				throw new Error(`Producto con ID ${item.productId} no tiene un identificador válido`);
			}

			// Preparar el artículo del pedido
			const orderItem: OrderItem = {
				productId: productId,
				quantity: item.quantity,
				price: price,
				variation: item.variation,
			};
			items.push(orderItem);

			// Calcular monto total
			totalAmount += price * item.quantity;
		}

		// Preparar datos del pedido
		const order: Order = {
			userId: userId,
			items: items,
			totalAmount: totalAmount,
			status: 'pendiente',
			shippingAddress: orderData.shippingAddress as ShippingAddress,
			paymentMethod: orderData.paymentMethod || 'defaultPaymentMethod',
			createdAt: new Date(),
			updatedAt: new Date(),
			isActive: true,
		};

		// Crear pedido
		const createdOrder = await this.orderModel.createOrder(order);
		return createdOrder;
	}

	async getOrderById(orderId: string): Promise<Order> {
		const order = await this.orderModel.getOrderById(orderId);
		if (!order) {
			throw new Error('Pedido no encontrado');
		}
		return order;
	}

	async getOrdersByUserId(userId: string): Promise<Order[]> {
		return this.orderModel.getOrdersByUserId(userId);
	}

	async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
		const allowedStatuses: OrderStatus[] = ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado', 'devuelto'];
		if (!allowedStatuses.includes(status)) {
			throw new Error('Estado de pedido inválido');
		}
		await this.orderModel.updateOrder(orderId, { status });
	}

	async getAllOrders(): Promise<Order[]> {
		return this.orderModel.getAllOrders();
	}

	async cancelOrder(orderId: string): Promise<void> {
		await this.orderModel.cancelOrder(orderId);
	}
}
