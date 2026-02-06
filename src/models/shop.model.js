//!dmbg
import { Schema, model } from "mongoose";
const COLLECTION_NAME = "Shops";
const DOCUMENT_NAME = "Shop";

var shopSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    role: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true, collection: COLLECTION_NAME },
);

//Export the model
export default model(DOCUMENT_NAME, shopSchema);
