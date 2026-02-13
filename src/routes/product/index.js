import express from "express";
const productRouter = express.Router();
import { productController } from "../../controllers/product.controller.js";
import { asyncHandler } from "../../helpers/asynHandler.js";
import { authenticate } from "../../auth/checkAuth.js";

productRouter.get('', asyncHandler(productController.getAllProducts));
productRouter.get(
  "/search/:keySearch",
  asyncHandler(productController.getListSearchProduct),
);
productRouter.get("/:productId", asyncHandler(productController.getProduct));


productRouter.use(authenticate);
productRouter.post("/create", asyncHandler(productController.createProduct));
productRouter.post("/update/:productId", asyncHandler(productController.updateProduct));

productRouter.post(
  "/publish/:id",
  asyncHandler(productController.publishProductByShop),
);
productRouter.post(
  "/unpublish/:id",
  asyncHandler(productController.unPublishProductByShop),
);

productRouter.get(
  "/drafts",
  asyncHandler(productController.getAllDraftsForShop),
);
productRouter.get(
  "/published",
  asyncHandler(productController.getAllPublishedForShop),
);

export default productRouter;
