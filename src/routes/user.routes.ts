// src/routes/userRoutes.ts
import { Router } from 'express';
import { UserController } from '@/controllers/user.controller';
import { validate } from '@/utils/validate';
import {
	registerUserSchema,
	loginUserSchema,
	updateUserProfileSchema,
	requestPasswordResetSchema,
	resetPasswordSchema,
} from '@/schemas/user.schema';

const userRouter = Router();
const userController = new UserController();

// Register a new user
userRouter.post(
	'/register',
	validate(registerUserSchema),
	(req, res) => userController.registerUser(req, res)
);

// Login user
userRouter.post(
	'/login',
	validate(loginUserSchema),
	(req, res) => userController.loginUser(req, res)
);

// Update user profile
userRouter.put(
	'/:id',
	validate(updateUserProfileSchema),
	(req, res) => userController.updateUserProfile(req, res)
);

// Request password reset
userRouter.post(
	'/request-password-reset',
	validate(requestPasswordResetSchema),
	(req, res) => userController.requestPasswordReset(req, res)
);

// Reset password
userRouter.post(
	'/reset-password',
	validate(resetPasswordSchema),
	(req, res) => userController.resetPassword(req, res)
);

// Logout and Get Profile routes remain the same
userRouter.post('/logout', (req, res) => userController.logoutUser(req, res));
userRouter.get('/:id', (req, res) => userController.getUserProfile(req, res));

userRouter.get('/by-type/:type', (req, res) => userController.getUsersByType(req, res));

userRouter.get('/', (req, res) => userController.getAllUsers(req, res));

userRouter.delete('/:id', (req, res) => userController.deactivateUser(req, res));

export default userRouter;
