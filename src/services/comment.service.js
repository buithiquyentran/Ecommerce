import commentModel from "../models/comment.model.js";
import { findProduct } from "../models/repositories/product.repo.js";
/*  
    key features:
    - add comment [user, shop]
    - get list comment by productId (pagination, sort by time)
    - reply comment (create comment with parentId)
    - delete comment [user, shop, admin]
*/
class CommentService {
  static async createComment({ userId, productId, parentId = null, content }) {
    const comment = await commentModel.create({
      comment_userId: userId,
      comment_productId: productId,
      comment_parentId: null,
      comment_content: content,
    });
    if (parentId) {
      //reply comment
      const parentComment = await commentModel.findById(parentId);
      if (!parentComment) {
        throw new Error("Parent comment not found");
      }
      const parentRight = parentComment.comment_right;
      comment.comment_parentId = parentId;
      comment.comment_left = parentRight;
      comment.comment_right = parentRight + 1;

      await commentModel.updateMany(
        { comment_productId: productId, comment_right: { $gte: parentRight } },
        { $inc: { comment_right: 2 } },
      );
      await commentModel.updateMany(
        {
          comment_productId: productId,
          comment_left: { $gt: parentRight },
        },
        { $inc: { comment_left: 2 } },
      );
      await comment.save();
      return comment;
    } else {
      // find the maxRight
      const maxRight = await commentModel
        .findOne({ comment_productId: productId })
        .sort("-comment_right")
        .select("comment_right");
      const right = maxRight ? maxRight.comment_right + 1 : 1;
      comment.comment_left = right;
      comment.comment_right = right + 1;
      await comment.save();
      return comment;
    }
  }
  static async deleteComment({ commentId, productId, userId }) {
    const foundProduct = await findProduct({productId});
    if (!foundProduct) {
      throw new Error("Product not found");
    }
    const comment = await commentModel.findById(commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }
    if (comment.comment_userId.toString() !== userId.toString()) {
      throw new Error("You are not authorized to delete this comment");
    }
    
    const leftValue = comment.comment_left;
    const rightValue = comment.comment_right;
    const width = rightValue - leftValue + 1;
    // delete comment and its children
    await commentModel.deleteMany({
      comment_productId: productId,
      comment_left: { $gte: leftValue },
      comment_right: { $lte: rightValue },
    });
    // update left and right value of remaining comments
    await commentModel.updateMany(
      { comment_productId: productId, comment_left: { $gt: rightValue } },
      { $inc: { comment_left: -width } },
    );  
    await commentModel.updateMany(
      { comment_productId: productId, comment_right: { $gt: rightValue } },
      { $inc: { comment_right: -width } },
    );
    return true;
  }
  static async getCommentsByParentId({
    parentId = null,
    productId,
    page = 1,
    limit = 10,
  }) {
    if (parentId === null) {
      // Get top-level comments
      const skip = (page - 1) * limit;
      const comments = await commentModel
        .find({
          comment_productId: productId,
          comment_parentId: null,
          comment_isDeleted: false,
        })
        .select({
          comment_left: 1,
          comment_right: 1,
          comment_content: 1,
          comment_parentId: 1,
          comment_userId: 1,
        })
        .sort("comment_left")
        .skip(skip)
        .limit(limit);
      return comments;
    }
    const parentComment = await commentModel.findById(parentId);
    if (!parentComment) {
      throw new Error("Parent comment not found");
    }
    const skip = (page - 1) * limit;
    const comments = await commentModel
      .find({
        comment_productId: productId,
        comment_parentId: parentId,
        comment_left: { $gt: parentComment.comment_left },
        comment_right: { $lt: parentComment.comment_right },
        comment_isDeleted: false,
      })
      .select({
        comment_left: 1,
        comment_right: 1,
        comment_content: 1,
        comment_parentId: 1,
        comment_userId: 1,
      })
      .sort("comment_left")
      .skip(skip)
      .limit(limit);
    return comments;
  }
}
export default CommentService;
