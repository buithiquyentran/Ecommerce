import { model, Schema } from "mongoose";
const COLLECTION_NAME = "Notifications";
const DOCUMENT_NAME = "Notification";

// ORDER-001: order success
// ORDER-003: order failed
// PROMOTION-001: product out of stock
// SHOP-001: new product by user following

const notificationschema = new Schema(
  {
    notification_type: {
      type: String,
      enum: ["ORDER-001", "ORDER-002", "PROMOTION-001", "SHOP-001"],
    },
    notification_senderId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    // notification_receiverId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "User",
    // },
    notification_receiverId: {
      type: Number,
    },
    notification_content: {
      type: String,
      default: "",
    },
    notification_options: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true, collection: COLLECTION_NAME },
);

export default model(DOCUMENT_NAME, notificationschema);
