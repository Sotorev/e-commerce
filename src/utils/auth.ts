import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface CustomRequest extends Request {
	user?: any;
}

export const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
	const token = req.headers["authorization"]?.split(' ')[1];
	if (!token) return res.status(403).json({ error: "Token no proporcionado" });

	jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
		if (err) return res.status(403).json({ error: "Token inválido" });
		req.user = user;
		next();
	});
};

export const generateToken = (user: any) => {
	return jwt.sign(user, process.env.JWT_SECRET as string, { expiresIn: "1h" });
};