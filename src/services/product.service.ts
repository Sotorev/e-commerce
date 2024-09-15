// src/services/product.service.ts
import { ProductModel, Product } from '@/models/product.model';
import { ObjectId } from 'mongodb';

export class ProductService {
	private productModel: ProductModel;

	constructor() {
		this.productModel = new ProductModel();
	}

	async addProduct(productData: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
		const newProduct: Product = {
			...productData,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		return this.productModel.createProduct(newProduct);
	}

	async getAllProducts(): Promise<Product[]> {
		return this.productModel.getProducts();
	}

	async getProductById(id: string): Promise<Product | null> {
		return this.productModel.getProductById(id);
	}

	async updateProduct(id: string, productData: Partial<Product>): Promise<void> {
		const product = await this.productModel.getProductById(id);
		if (!product) {
			throw new Error('Product not found');
		}

		const updatedProduct = {
			...product,
			...productData,
			updatedAt: new Date(),
		};

		return this.productModel.updateProduct(id, updatedProduct);
	}

	async deleteProduct(id: string): Promise<void> {
		const product = await this.productModel.getProductById(id);
		if (!product) {
			throw new Error('Product not found');
		}
		return this.productModel.deleteProduct(id);
	}
}
