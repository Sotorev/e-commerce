import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from '@/utils/auth';

export const authorize = (role: 'admin' | 'user') => {
	return (req: CustomRequest, res: Response, next: NextFunction) => {
		if (req.user && req.user.role === role) {
			return next();
		}
		return res.status(403).json({ error: 'Forbidden' });
	};
};
