import express from "express";
import db from "./utils/db";
import cors from "cors";
import userRoutes from "./routes/user.routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/users', userRoutes);

const port = 4000;

(async () => {
	try {
		await db.connect();
	} catch (error) {
		console.error('Error al iniciar la aplicación:', error);
	}
})();

app.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});