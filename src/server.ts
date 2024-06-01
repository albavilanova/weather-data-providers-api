import cors from "cors";
import express from "express";
import morgan from "morgan";

import providersRouter from "./router/providers";
import productsRouter from './router/products';
import usersRouter from "./router/users";
import reviewsRouter from "./router/reviews";

const app = express();

// For headers
app.use(cors());

// Logger
app.use(morgan("dev"));

// JSON parser
app.use(express.json());

// Set up routers
app.use("/providers", providersRouter);
app.use("/products", productsRouter);
app.use("/users", usersRouter);
app.use("/reviews", reviewsRouter);

const { PORT } = process.env;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
