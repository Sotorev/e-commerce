import { SupplierModel, Supplier } from '@/models/supplier.model';
import { ObjectId } from 'mongodb';
import { ProductModel } from '@/models/product.model';

export class SupplierService {
	private supplierModel: SupplierModel;
	private productModel: ProductModel;

	constructor() {
		this.supplierModel = new SupplierModel();
		this.productModel = new ProductModel();
	}

	async createSupplier(supplierData: Partial<Supplier>): Promise<Supplier> {
		if (!supplierData.name || !supplierData.contactInfo) {
			throw new Error('El nombre y la información de contacto son requeridos');
		}
		const supplier: Supplier = {
			name: supplierData.name,
			contactInfo: supplierData.contactInfo,
			productsSupplied: supplierData.productsSupplied || [],
			isActive: true,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		return this.supplierModel.createSupplier(supplier);
	}

	async getSupplierById(supplierId: string): Promise<Supplier> {
		const supplier = await this.supplierModel.getSupplierById(supplierId);
		if (!supplier) {
			throw new Error('Proveedor no encontrado');
		}
		return supplier;
	}

	async updateSupplier(supplierId: string, updateData: Partial<Supplier>): Promise<void> {
		await this.supplierModel.updateSupplier(supplierId, updateData);
	}

	async deactivateSupplier(supplierId: string): Promise<void> {
		// Opcionalmente, puedes actualizar los productos relacionados
		await this.supplierModel.deactivateSupplier(supplierId);
	}

	async getAllSuppliers(): Promise<Supplier[]> {
		return this.supplierModel.getAllSuppliers();
	}
}
