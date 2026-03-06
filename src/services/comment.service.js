import commentModel from "../models/comment.model.js";
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
        { $inc: { comment_right: 2 } }
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
}
export default CommentService;
