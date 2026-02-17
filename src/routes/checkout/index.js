import express from "express";
const checkoutRouter = express.Router();
import checkoutController  from "../../controllers/checkout.controller.js";
import { asyncHandler } from "../../helpers/asynHandler.js";


checkoutRouter.post("", asyncHandler(checkoutController.checkoutReview));

export default checkoutRouter;
