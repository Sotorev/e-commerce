import { Router } from 'express';
import { SupplierController } from '@/controllers/supplier.controller';
import { validate } from '@/utils/validate';
import {
	createSupplierSchema,
	updateSupplierSchema,
} from '@/schemas/supplier.schema';

const supplierRouter = Router();
const supplierController = new SupplierController();

// Crear un nuevo proveedor
supplierRouter.post(
	'/',
	validate(createSupplierSchema),
	(req, res) => supplierController.createSupplier(req, res)
);

// Obtener proveedor por ID
supplierRouter.get(
	'/:id',
	(req, res) => supplierController.getSupplierById(req, res)
);

// Actualizar proveedor
supplierRouter.put(
	'/:id',
	validate(updateSupplierSchema),
	(req, res) => supplierController.updateSupplier(req, res)
);

// Desactivar proveedor
supplierRouter.delete(
	'/:id',
	(req, res) => supplierController.deactivateSupplier(req, res)
);

// Obtener todos los proveedores
supplierRouter.get(
	'/',
	(req, res) => supplierController.getAllSuppliers(req, res)
);

export default supplierRouter;
