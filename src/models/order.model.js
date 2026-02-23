import { Schema, model } from "mongoose";
const COLLECTION_NAME = "orders";
const DOCUMENT_NAME = "order";
var orderSchema = new Schema(
  {
    order_userId: {
      type: String,
      required: true,
    },
    order_checkout: {
      type: Array,
      default: [],
    },
    /*
      {
        totalPrice: 0, // total raw price before discount
        feeShip: 0, // fee ship
        totalDiscount: 0, // total discount
        totalPayment: 0, // total payment after discount and fee ship
      },
    */

    order_products: {
      type: Array,
      default: [],
      required: true,
    },
    order_payment: {
      type: Object,
      default: {},
    },
    order_shippingAddress: {
      type: Object,
      default: {},
    },
    order_trackingNumber: {
      type: String,
      default: "0123022026",
    },
    order_status: {
      type: String,
      enum: ["pending", "comformed", "cancelled", "shipped", "delivered"],
      default: "pending",
    },
  },
  { timestamps: true, collection: COLLECTION_NAME },
);

//Export the model
export default model(DOCUMENT_NAME, orderSchema);
