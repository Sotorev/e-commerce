import { Request, Response } from 'express';
import { SupplierService } from '@/services/supplier.service';

export class SupplierController {
	private supplierService: SupplierService;

	constructor() {
		this.supplierService = new SupplierService();
	}

	async createSupplier(req: Request, res: Response): Promise<void> {
		try {
			const supplierData = req.body;
			const supplier = await this.supplierService.createSupplier(supplierData);
			res.status(201).json({ message: 'Proveedor creado con éxito', supplier });
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}

	async getSupplierById(req: Request, res: Response): Promise<void> {
		try {
			const supplierId = req.params.id;
			const supplier = await this.supplierService.getSupplierById(supplierId);
			res.status(200).json({ supplier });
		} catch (error: any) {
			res.status(404).json({ error: error.message });
		}
	}

	async updateSupplier(req: Request, res: Response): Promise<void> {
		try {
			const supplierId = req.params.id;
			const updateData = req.body;
			await this.supplierService.updateSupplier(supplierId, updateData);
			res.status(200).json({ message: 'Proveedor actualizado con éxito' });
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}

	async deactivateSupplier(req: Request, res: Response): Promise<void> {
		try {
			const supplierId = req.params.id;
			await this.supplierService.deactivateSupplier(supplierId);
			res.status(200).json({ message: 'Proveedor desactivado con éxito' });
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}

	async getAllSuppliers(req: Request, res: Response): Promise<void> {
		try {
			const suppliers = await this.supplierService.getAllSuppliers();
			res.status(200).json({ suppliers });
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}
}
