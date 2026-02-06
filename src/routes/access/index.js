import express from "express";
const router = express.Router();
import { accessController } from "../../controllers/access.controller.js";
//Sign up

router.post("/signup", accessController.signUp);
export { router };
