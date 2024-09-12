import { MongoClient, ServerApiVersion } from 'mongodb';

class Database {
	private client: MongoClient | null;

	constructor() {
		this.client = null;
	}

	async connect(): Promise<MongoClient> {
		if (!this.client) {
			try {
				this.client = new MongoClient(Bun.env.MONGO_URI!, {
					serverApi: {
						version: ServerApiVersion.v1,
						strict: true,
						deprecationErrors: true,
					}
				});
				await this.client.connect();
				console.log('Conexión a MongoDB establecida');
			} catch (error) {
				console.error('Error al conectarse a MongoDB:', error);
				throw error;
			}
		}
		return this.client;
	}

	async getCollection(collectionName: string) {
		if (!this.client) {
			throw new Error('No hay conexión a MongoDB');
		}
		return this.client.db(Bun.env.DB_NAME!).collection(collectionName);
	}

	async close() {
		if (this.client) {
			await this.client.close();
			this.client = null;
		}
	}
	async startSession() {
		if (!this.client) {
			throw new Error('No hay conexión a MongoDB');
		}
		return this.client.startSession();
	}
}

// Exporta una instancia de la clase Database
export default new Database();


