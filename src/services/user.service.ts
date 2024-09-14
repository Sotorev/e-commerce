import { MongoClient, Collection, ObjectId } from "mongodb";
import { User, createUser } from "@/models/user.model";
import bcrypt from "bcrypt";

const client = new MongoClient(process.env.MONGO_URI as string);

const getUserCollection = async (): Promise<Collection<User>> => {
	if (client) await client.connect();
	return client.db("e-commerce").collection("users");
};

export const registerUser = async (username: string, email: string, password: string): Promise<User> => {
	const users = await getUserCollection();
	const salt = bcrypt.genSaltSync(10);
	const passwordHash = bcrypt.hashSync(password, salt);

	const newUser: User = createUser({
		username,
		email,
		passwordHash,
		salt,
		isEmailVerified: false,
		twoFactorEnabled: false,
		failedLoginAttempts: 0,
		accountStatus: "active",
		twoFactorSecret: undefined,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString()
	});

	await users.insertOne(newUser);
	return newUser;
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
	const users = await getUserCollection();
	return users.findOne({ email });
};

export const updateUserProfile = async (userId: ObjectId, updateData: Partial<User>): Promise<User | null> => {
	const users = await getUserCollection();
	await users.updateOne({ _id: userId }, { $set: { ...updateData, updatedAt: new Date().toISOString() } });
	return users.findOne({ _id: userId });
};

export const resetPassword = async (email: string, newPassword: string): Promise<boolean> => {
	const users = await getUserCollection();
	const salt = bcrypt.genSaltSync(10);
	const passwordHash = bcrypt.hashSync(newPassword, salt);

	const result = await users.updateOne(
		{ email },
		{ $set: { passwordHash, salt, updatedAt: new Date().toISOString() } }
	);
	return result.modifiedCount > 0;
};
