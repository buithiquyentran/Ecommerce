import express from "express";
const notificationRouter = express.Router();
import notificationController  from "../../controllers/notification.controller.js";
import { asyncHandler } from "../../helpers/asynHandler.js";


notificationRouter.get("/list", asyncHandler(notificationController.getListNotiByUser));

export default notificationRouter;
