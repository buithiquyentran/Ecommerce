import express from "express";
const router = express.Router();
import { accessController } from "../../controllers/access.controller.js";
import { asyncHandler } from "../../helpers/asynHandler.js";
import { authenticate } from "../../auth/checkAuth.js";

//Sign up
router.post("/signup", asyncHandler(accessController.signUp));
router.post("/login", asyncHandler(accessController.login));
// router.post("/signup", (req, res, next) => {
//   accessController.signUp(req, res, next).catch(next);
// });


// authenticate
router.use(authenticate);
// logout
router.post("/logout", asyncHandler(accessController.logout));
export { router };
