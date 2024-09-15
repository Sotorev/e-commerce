// utils/db.ts
import { MongoClient, Db } from 'mongodb';

let dbInstance: Db | null = null;

export const getDb = async (): Promise<Db> => {
	if (dbInstance) {
		return dbInstance;
	}

	const client = new MongoClient(Bun.env.MONGO_URI as string);
	await client.connect();
	dbInstance = client.db(Bun.env.DB_NAME as string);
	return dbInstance;
};
