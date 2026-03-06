import express from "express";
const commentRouter = express.Router();
import commentController  from "../../controllers/comment.controller.js";
import { asyncHandler } from "../../helpers/asynHandler.js";


commentRouter.get("", asyncHandler(commentController.getCommentsByParentId));

commentRouter.post("/add-comment", asyncHandler(commentController.createComment));
commentRouter.delete("/:commentId", asyncHandler(commentController.deleteComment));
export default commentRouter;
