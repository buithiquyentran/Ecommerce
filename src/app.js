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
//init db
import mongoose from "./dbs/init.mongodb.js";
const connectString = "mongodb://localhost:27017/Ecommerce/Ecommerce";

// init routes
app.get("/", (req, res, next) => {
  const strCompress = "tran";
  return res
    .status(200)
    .json({ message: "API is working!", metadata: strCompress.repeat(1000) });
});
// handle error

export default app;
