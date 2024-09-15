// src/routes/product.routes.ts
import { Router } from 'express';
import { ProductController } from '@/controllers/product.controller';
import { validate } from '@/utils/validate';
import { productSchema, updateProductSchema } from '@/schemas/product.schema';

const productRouter = Router();
const productController = new ProductController();

// Fetch all products
productRouter.get('/', (req, res) => productController.getAllProducts(req, res));

// Fetch a single product by ID
productRouter.get('/:id', (req, res) => productController.getProductById(req, res));

// Add a new product (admin only)
productRouter.post('/', validate(productSchema), (req, res) => productController.addProduct(req, res));

// Update an existing product (admin only)
productRouter.put('/:id', validate(updateProductSchema), (req, res) => productController.updateProduct(req, res));

// Delete a product (admin only)
productRouter.delete('/:id', (req, res) => productController.deleteProduct(req, res));

export default productRouter;
