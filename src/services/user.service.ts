import { UserModel, User } from '@/models/user.model';
import bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { generateToken } from '@/utils/auth';

export class UserService {
	private userModel: UserModel;

	constructor() {
		this.userModel = new UserModel();
	}

	async registerUser(username: string, email: string, password: string, name: string, lastName: string, type: "user" | "admin" | "employee"): Promise<User> {
		const existingUser = await this.userModel.findUserByEmail(email);
		if (existingUser) {
			throw new Error('El usuario ya existe');
		}

		const salt = bcrypt.genSaltSync(10);
		const passwordHash = bcrypt.hashSync(password, salt);

		const newUser: User = {
			name,
			lastName,
			username,
			email,
			passwordHash,
			salt,
			isEmailVerified: false,
			twoFactorEnabled: false,
			failedLoginAttempts: 0,
			accountStatus: 'active',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			type: type
		};

		return this.userModel.createUser(newUser);
	}

	async loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
		const user = await this.userModel.findUserByEmail(email);
		if (!user) {
			throw new Error('Correo o contraseña incorrectos');
		}

		const validPassword = bcrypt.compareSync(password, user.passwordHash);
		if (!validPassword) {
			throw new Error('Correo o contraseña incorrectos');
		}

		const token = generateToken({ id: user._id, email: user.email });

		return { user, token };
	}

	async getUserProfile(userId: string): Promise<User> {
		const objectId = new ObjectId(userId);
		const user = await this.userModel.findUserById(objectId);
		if (!user) {
			throw new Error('Usuario no encontrado');
		}
		return user;
	}

	async updateUserProfile(userId: string, updateData: Partial<User>): Promise<User> {
		const objectId = new ObjectId(userId);
		const user = await this.userModel.updateUser(objectId, updateData);
		if (!user) {
			throw new Error('Usuario no encontrado');
		}
		return user;
	}

	async resetPassword(email: string, newPassword: string): Promise<boolean> {
		const salt = bcrypt.genSaltSync(10);
		const passwordHash = bcrypt.hashSync(newPassword, salt);
		return this.userModel.updatePassword(email, passwordHash, salt);
	}

	async requestPasswordReset(email: string): Promise<void> {
		const user = await this.userModel.findUserByEmail(email);
		if (!user) {
			throw new Error('Usuario no encontrado');
		}

		// Generate a password reset token (this is a simplified example)
		const resetToken = generateToken({ id: user._id }, '1h'); // Expires in 1 hour

		// TODO: Send resetToken via email to the user
		console.log(`Token de restablecimiento para ${email}: ${resetToken}`);
	}
}
