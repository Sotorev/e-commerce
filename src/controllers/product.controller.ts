// src/controllers/product.controller.ts
import { Request, Response } from 'express';
import { ProductService } from '@/services/product.service';

export class ProductController {
	private productService: ProductService;

	constructor() {
		this.productService = new ProductService();
	}

	async getAllProducts(req: Request, res: Response): Promise<void> {
		try {
			const products = await this.productService.getAllProducts();
			res.status(200).json(products);
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}

	async getProductById(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			const product = await this.productService.getProductById(id);
			if (!product) {
				res.status(404).json({ error: 'Product not found' });
				return;
			}
			res.status(200).json(product);
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}

	async addProduct(req: Request, res: Response): Promise<void> {
		try {
			const productData = req.body;
			const newProduct = await this.productService.addProduct(productData);
			res.status(201).json(newProduct);
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}

	async updateProduct(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			const productData = req.body;
			await this.productService.updateProduct(id, productData);
			res.status(200).json({ message: 'Product updated successfully' });
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}

	async deleteProduct(req: Request, res: Response): Promise<void> {
		try {
			const { id } = req.params;
			await this.productService.deleteProduct(id);
			res.status(200).json({ message: 'Product deleted successfully' });
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}
}
