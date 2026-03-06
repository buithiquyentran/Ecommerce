import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";

const app = express();
// init middlewares
app.use(morgan("dev"));
// app.use(morgan("combined"));
// app.use(morgan("common"));
// app.use(morgan("short"));
// app.use(morgan("tiny"));

app.use(helmet());
// app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//init db
import mongoose from "./dbs/init.mongodb.js";
//test publish subscribe redis
// import inventoryTestService from "./test/inventory.test.js";
// import productTestService from "./test/product.test.js";
// await inventoryTestService.init();
// productTestService.purchaseProduct("product123", 2);
// productTestService.purchaseProduct("product1234", 4);

// init routes
import { router } from "./routes/index.js";
app.use("/", router);

// handle error
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.statusCode = 404;
  next(error);
});
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack: err.stack,
    message: err.message || "Internal Server Error",
  });
});
export default app;
