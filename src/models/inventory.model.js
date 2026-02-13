import { Schema, model } from "mongoose";
const COLLECTION_NAME = "Inventories";
const DOCUMENT_NAME = "Inventory";
var inventorySchema = new Schema(
  {
    inven_productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    inven_stock: {
      type: Number,
      required: true,
    },
    inven_location: {
      type: String,
      default: "unknown",
    },
    inven_stock: {
      type: Number,
      required: true,
    },
    inven_shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    inven_reservation: {
      type: [],
      default: [],
    },
  },
  { timestamps: true, collection: COLLECTION_NAME },
);

//Export the model
export default model(DOCUMENT_NAME, inventorySchema);
