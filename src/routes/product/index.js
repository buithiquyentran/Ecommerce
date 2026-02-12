import express from "express";
const productRouter = express.Router();
import { productController } from "../../controllers/product.controller.js";
import { asyncHandler } from "../../helpers/asynHandler.js";
import { authenticate } from "../../auth/checkAuth.js";

productRouter.use(authenticate);
productRouter.post("/create", asyncHandler(productController.createProduct));
productRouter.get("/drafts", asyncHandler(productController.getAllDraftsForShop));
export default productRouter;