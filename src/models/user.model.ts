import { Collection, ObjectId } from 'mongodb';
import { getDb } from '@/utils/db';

export interface User {
	_id?: ObjectId | string;
	username: string;
	name: string;
	lastName: string;
	email: string;
	passwordHash: string;
	salt: string;
	isEmailVerified: boolean;
	twoFactorEnabled: boolean;
	twoFactorSecret?: string;
	failedLoginAttempts: number;
	accountStatus: "active" | "locked";
	createdAt: String;
	updatedAt: String;
	type: "customer" | "admin" | "employee";
	isActive?: boolean;
}

export class UserModel {
	private collectionName = 'users';

	private async getCollection(): Promise<Collection<User>> {
		const db = await getDb();
		return db.collection<User>(this.collectionName);
	}

	async createUser(user: User): Promise<User> {
		user.isActive = true;
		user.createdAt = new Date().toISOString();
		user.updatedAt = new Date().toISOString();
		const users = await this.getCollection();
		const result = await users.insertOne(user);
		return { ...user, _id: result.insertedId };
	}

	async findUserByEmail(email: string): Promise<User | null> {
		const users = await this.getCollection();
		return users.findOne({ email });
	}

	async findUserById(userId: ObjectId): Promise<User | null> {
		const users = await this.getCollection();
		return users.findOne({ _id: userId });
	}

	async updateUser(userId: ObjectId, updateData: Partial<User>): Promise<User | null> {
		updateData.updatedAt = new Date().toISOString();
		const users = await this.getCollection();
		await users.updateOne(
			{ _id: userId },
			{ $set: { ...updateData, updatedAt: new Date().toISOString() } }
		);
		return users.findOne({ _id: userId });
	}

	async updatePassword(email: string, passwordHash: string, salt: string): Promise<boolean> {
		const users = await this.getCollection();
		const result = await users.updateOne(
			{ email },
			{ $set: { passwordHash, salt, updatedAt: new Date().toISOString() } }
		);
		return result.modifiedCount > 0;
	}

	async getUsersByType(userType: "customer" | "admin" | "employee"): Promise<User[]> {
		const users = await this.getCollection();
		return users.find({ type: userType, isActive:true }).toArray();
	}
}