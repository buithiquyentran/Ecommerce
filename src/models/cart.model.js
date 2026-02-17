
import { Schema, model } from "mongoose";
const COLLECTION_NAME = "Carts";
const DOCUMENT_NAME = "cart";
var cartSchema = new Schema(
  {
    cart_state: {
      type: String,
      enum: ["active", "completed", "expired", "pending"],
      default: "active",
    },
    cart_products: {
      type: Array,
      default: [],
    },
    /*
        _id, name, price, quantity, shopId
     */
    cart_count_product: {
      type: Number,
      default: 0,
      min: 0,
    },
    cart_userId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: COLLECTION_NAME },
);

//Export the model
export default model(DOCUMENT_NAME, cartSchema);
