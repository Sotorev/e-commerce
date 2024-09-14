import { Request, Response } from "express";
import { registerUser, findUserByEmail, updateUserProfile, resetPassword } from "@/services/user.service";
import bcrypt from "bcrypt";
import { generateToken } from "@/utils/auth";
import { ObjectId } from "mongodb";
import { TypedRequestBody } from "../../types/request";


export const register = async (req: Request, res: Response) => {
	const { username, email, password } = req.body;
	if (!username || !email || !password) {
		return res.status(400).json({ error: "Faltan campos obligatorios" });
	}

	try {
		const existingUser = await findUserByEmail(email);
		if (existingUser) {
			return res.status(409).json({ error: "El usuario ya existe" });
		}

		const newUser = await registerUser(username, email, password);
		res.status(201).json({ message: "Usuario registrado con éxito", user: newUser });
	} catch (error) {
		res.status(500).json({ error: "Error al registrar el usuario" });
	}
};

export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ error: "Faltan campos obligatorios" });
	}

	try {
		const user = await findUserByEmail(email);
		if (!user) {
			return res.status(401).json({ error: "Correo o contraseña incorrectos" });
		}

		const validPassword = bcrypt.compareSync(password, user.passwordHash);
		if (!validPassword) {
			return res.status(401).json({ error: "Correo o contraseña incorrectos" });
		}

		const token = generateToken({ id: user._id, email: user.email });
		res.status(200).json({ message: "Inicio de sesión exitoso", token });
	} catch (error) {
		res.status(500).json({ error: "Error al iniciar sesión" });
	}
};

export const logout = (req: Request, res: Response) => {
	res.status(200).json({ message: "Sesión cerrada correctamente" });
};

export const getProfile = async (req: Request, res: Response) => {
	const userId = req.params.id as string;
	try {
		const user = await findUserByEmail(userId);
		if (!user) {
			return res.status(404).json({ error: "Usuario no encontrado" });
		}

		res.status(200).json({ user });
	} catch (error) {
		res.status(500).json({ error: "Error al obtener el perfil" });
	}
};

export const updateProfile = async (req: Request, res: Response) => {
	const userId = req.params.id as string;
	const updateData = req.body;
	try {
		const updatedUser = await updateUserProfile(new ObjectId(userId), updateData);
		if (!updatedUser) {
			return res.status(404).json({ error: "Usuario no encontrado" });
		}
		res.status(200).json({ message: "Perfil actualizado", user: updatedUser });
	} catch (error) {
		res.status(500).json({ error: "Error al actualizar el perfil" });
	}
};

export const requestPasswordReset = async (req: Request, res: Response) => {
	const { email } = req.body;
	if (!email) {
		return res.status(400).json({ error: "Correo electrónico requerido" });
	}

	try {
		const user = await findUserByEmail(email);
		if (!user) {
			return res.status(404).json({ error: "Usuario no encontrado" });
		}

		// Enviar correo de restablecimiento (solo simulado aquí)
		res.status(200).json({ message: "Correo de restablecimiento enviado" });
	} catch (error) {
		res.status(500).json({ error: "Error al solicitar restablecimiento de contraseña" });
	}
};

export const resetPasswordHandler = async (req: Request, res: Response) => {
	const { email, newPassword } = req.body;
	if (!email || !newPassword) {
		return res.status(400).json({ error: "Faltan campos obligatorios" });
	}

	try {
		const success = await resetPassword(email, newPassword);
		if (!success) {
			return res.status(400).json({ error: "No se pudo restablecer la contraseña" });
		}

		res.status(200).json({ message: "Contraseña restablecida con éxito" });
	} catch (error) {
		res.status(500).json({ error: "Error al restablecer la contraseña" });
	}
};
