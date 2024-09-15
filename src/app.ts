import express from "express";
import cors from "cors";
import userRouter from "./routes/user.routes";
import productRouter from "./routes/product.routes";
import faqRouter from "./routes/faq.routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/faqs', faqRouter);

app.get('/', (req, res) => {
	res.send('Hello World!');
});

const port = 4000;


app.listen(port, () => {
	console.log(`Listening on port ${port}...`);
});