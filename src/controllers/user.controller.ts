import { Request, Response } from 'express';
import { UserService } from '@/services/user.service';

export class UserController {
	private userService: UserService;

	constructor() {
		this.userService = new UserService();
	}

	async registerUser(req: Request, res: Response): Promise<void> {
		const { username, email, password, name, lastName, type } = req.body;
		try {
			const user = await this.userService.registerUser(username, email, password, name, lastName, type);
			res.status(201).json({ message: 'Usuario registrado con éxito', user });
		} catch (error: any) {
			res.status(400).json({ error: error.message });
		}
	}

	async loginUser(req: Request, res: Response): Promise<void> {
		const { email, password } = req.body;
		try {
			const { user, token } = await this.userService.loginUser(email, password);
			res.status(200).json({ message: 'Inicio de sesión exitoso', token });
		} catch (error: any) {
			res.status(401).json({ error: error.message });
		}
	}

	logoutUser(req: Request, res: Response): void {
		// For token-based authentication, logout is handled on the client side
		res.status(200).json({ message: 'Sesión cerrada correctamente' });
	}

	async getUserProfile(req: Request, res: Response): Promise<void> {
		const userId = req.params.id as string;
		try {
			const user = await this.userService.getUserProfile(userId);
			res.status(200).json({ user });
		} catch (error: any) {
			res.status(404).json({ error: error.message });
		}
	}

	async updateUserProfile(req: Request, res: Response): Promise<void> {
		const userId = req.params.id as string;
		const updateData = req.body;
		try {
			const user = await this.userService.updateUserProfile(userId, updateData);
			res.status(200).json({ message: 'Perfil actualizado', user });
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}

	async requestPasswordReset(req: Request, res: Response): Promise<void> {
		const { email } = req.body;
		if (!email) {
			res.status(400).json({ error: 'Correo electrónico requerido' });
			return;
		}

		try {
			await this.userService.requestPasswordReset(email);
			res.status(200).json({ message: 'Correo de restablecimiento enviado' });
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}

	async resetPassword(req: Request, res: Response): Promise<void> {
		const { email, newPassword } = req.body;
		if (!email || !newPassword) {
			res.status(400).json({ error: 'Faltan campos obligatorios' });
			return;
		}

		try {
			const success = await this.userService.resetPassword(email, newPassword);
			if (success) {
				res.status(200).json({ message: 'Contraseña restablecida con éxito' });
			} else {
				res.status(400).json({ error: 'No se pudo restablecer la contraseña' });
			}
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}

	async getUsersByType(req: Request, res: Response): Promise<void> {
		const type  = req.params.type as "customer" | "admin" | "employee";
		try {
			const users = await this.userService.getUsersByType(type);
			res.status(200).json({ users });
		} catch (error: any) {
			res.status(500).json({ error: error.message });
		}
	}
}
