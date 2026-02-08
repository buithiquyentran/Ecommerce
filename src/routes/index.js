import express from "express";
import { router as accessRouter } from "./access/index.js";
const router = express.Router();
import {apiKey, permission} from "../auth/checkAuth.js";

// check api v1
router.use(apiKey)
// check permission
// router.use(permission("000"));
router.use("/v1/api", accessRouter);
// router.get("", (req, res) => {
//   return res.status(200).json({ message: "API is working!" });
// });

export { router };
