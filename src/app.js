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

// init routes
import { router } from "./routes/index.js";
app.use("/", router);
// handle error

export default app;
