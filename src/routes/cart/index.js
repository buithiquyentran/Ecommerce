import express from "express";
const cartRouter = express.Router();
import cartController from "../../controllers/cart.controller.js";
import { asyncHandler } from "../../helpers/asynHandler.js";

cartRouter.post("", asyncHandler(cartController.createCart));
cartRouter.patch("", asyncHandler(cartController.updateCart));
cartRouter.get("/products", asyncHandler(cartController.getCartProducts));
cartRouter.delete("/user", asyncHandler(cartController.deleteCart));
cartRouter.delete("/product", asyncHandler(cartController.removeFromCart));
cartRouter.delete("/clear", asyncHandler(cartController.clearCart));
export default cartRouter;
