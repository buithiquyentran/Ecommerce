import express from "express";
const inventoryRouter = express.Router();
import inventoryController  from "../../controllers/inventory.controller.js";
import { asyncHandler } from "../../helpers/asynHandler.js";


inventoryRouter.post("/add-stock", asyncHandler(inventoryController.inventoryReview));

export default inventoryRouter;
