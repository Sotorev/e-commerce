// src/schemas/userSchemas.ts
import { z } from 'zod';

export const registerUserSchema = z.object({
	name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
	lastName: z.string().min(2, { message: 'El apellido debe tener al menos 2 caracteres' }),
	username: z.string().min(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' }),
	email: z.string().email({ message: 'Correo electrónico inválido' }),
	password: z.string().min(5, { message: 'La contraseña debe tener al menos 6 caracteres' }),
	type: z.enum(['user', 'admin', 'employee']),
});

export const loginUserSchema = z.object({
	email: z.string().email({ message: 'Correo electrónico inválido' }),
	password: z.string().min(5, { message: 'La contraseña debe tener al menos 6 caracteres' }),
});

export const updateUserProfileSchema = z.object({
	name: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
	lastName: z.string().min(2, { message: 'El apellido debe tener al menos 2 caracteres' }),
	username: z.string().min(3).optional(),
	email: z.string().email().optional(),
	password: z.string().min(5).optional(),
	type: z.enum(['user', 'admin', 'employee']).optional(),
	// Add other fields with appropriate validations
});

export const requestPasswordResetSchema = z.object({
	email: z.string().email({ message: 'Correo electrónico inválido' }),
});

export const resetPasswordSchema = z.object({
	email: z.string().email({ message: 'Correo electrónico inválido' }),
	newPassword: z.string().min(5, { message: 'La nueva contraseña debe tener al menos 6 caracteres' }),
});
