import { model, Schema } from "mongoose";
const COLLECTION_NAME = "Comments";
const DOCUMENT_NAME = "Comment";
const commentSchema = new Schema(
  {
    comment_userId: {
      type: String,
    },
    comment_productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    comment_parentId: {
      type: Schema.Types.ObjectId,
      ref: DOCUMENT_NAME,
    },
    comment_content: {
      type: String,
    },
    comment_left: {
      type: Number,
      default: 0,
    },
    comment_right: {
      type: Number,
      default: 0,
    },
    comment_isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, collection: COLLECTION_NAME },
);

export default model(DOCUMENT_NAME, commentSchema);
