import express from "express";
import cors from "cors";
import router from "./routes/index";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api", router);

app.get('/', (req, res) => {
	res.send('Hello World!');
});

const port = 4000;


app.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});