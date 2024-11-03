import express from "express";
import cors from "cors";
import router from "./routes/index";
import { createOrder, completeOrder } from "./checkout";

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api", router);

app.get('/', (req, res) => {
	res.send('Hello World!');
});

const port = 4000;

app.post('/create_order', createOrder);
app.post('/complete_order', completeOrder);

// Helper / Utility functions

//Servers the index.html file
app.get('/', (req, res) => {
	res.sendFile(process.cwd() + '/index.html');
});
//Servers the style.css file
app.get('/style.css', (req, res) => {
	res.sendFile(process.cwd() + '/style.css');
});
//Servers the script.js file
app.get('/script.js', (req, res) => {
	res.sendFile(process.cwd() + '/script.js');
});

app.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});

