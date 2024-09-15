import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UserModel } from "@/models/user.model";

export interface CustomRequest extends Request {
	user?: any;
}

export const authenticate = async (req: CustomRequest, res: Response, next: NextFunction) => {
	const token = req.headers.authorization?.split(' ')[1]; // Assuming Bearer token

	if (!token) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	try {
		const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
		const userModel = new UserModel();
		const user = await userModel.findUserById(decoded.userId);
		if (!user) {
			return res.status(401).json({ error: 'User not found' });
		}
		req.user = user;
		next();
	} catch (error: any) {
		res.status(401).json({ error: 'Invalid token' });
	}
};

// utils/auth.ts

export const generateToken = (payload: object, expiresIn: string = '7d'): string => {
	return jwt.sign(payload, Bun.env.JWT_SECRET as string, { expiresIn });
};

