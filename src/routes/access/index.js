import express from "express";
const router = express.Router();
import { accessController } from "../../controllers/access.controller.js";
import { asyncHandler } from "../../auth/checkAuth.js";

//Sign up
router.post("/signup", asyncHandler(accessController.signUp));
router.post("/login", asyncHandler(accessController.login));
// router.post("/signup", (req, res, next) => {
//   accessController.signUp(req, res, next).catch(next);
// });

export { router };
