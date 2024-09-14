import { ObjectId } from "mongodb";

export interface User {
	_id?: ObjectId | string;
	username: string;
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
}

export const createUser = (userData: Omit<User, '_id'>): User => ({
	...userData,
});
