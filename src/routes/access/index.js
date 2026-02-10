import express from "express";
const accessRouter = express.Router();
import { accessController } from "../../controllers/access.controller.js";
import { asyncHandler } from "../../helpers/asynHandler.js";
import { authenticate, authenRefreshToken } from "../../auth/checkAuth.js";

//Sign up
accessRouter.post("/signup", asyncHandler(accessController.signUp));
accessRouter.post("/login", asyncHandler(accessController.login));
accessRouter.post(
  "/refresh-token",
  authenRefreshToken,
  asyncHandler(accessController.handleRefreshToken),
);

// authenticate
accessRouter.use(authenticate);
// logout
accessRouter.post("/logout", asyncHandler(accessController.logout));

export default accessRouter;
