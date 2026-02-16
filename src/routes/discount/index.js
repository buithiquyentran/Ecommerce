import express from "express";
import { discountController } from "../../controllers/discount.controller.js";
import { asyncHandler } from "../../helpers/asynHandler.js";
import { authenticate } from "../../auth/checkAuth.js";

const discountRouter = express.Router();

discountRouter.get(
  "/amount",
  asyncHandler(discountController.getDiscountAmount),
);

discountRouter.use(authenticate);

discountRouter.get(
  "",
  asyncHandler(discountController.getProductsByDiscountCode),
);
discountRouter.post("/create", asyncHandler(discountController.createDiscount));
discountRouter.patch(
  "/update/:discountId",
  asyncHandler(discountController.updateDiscount),
);

discountRouter.get(
  "/all",
  asyncHandler(discountController.getAllDiscountsForShop),
);

discountRouter.delete(
  "/delete/:discountId",
  asyncHandler(discountController.deleteDiscount),
);
discountRouter.get(
  "/:discountId",
  asyncHandler(discountController.getDiscountById),
);

export default discountRouter;
