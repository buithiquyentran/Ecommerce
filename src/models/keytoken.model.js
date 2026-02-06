import { Schema, model } from "mongoose";
const COLLECTION_NAME = "Keys";
const DOCUMENT_NAME = "Key";
var keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    keyAccess: {
      type: String,
      required: true,
    },
    keyRefresh: {
      type: String,
      required: true,
    },  
    refreshToken: {
      type: Array,
      default: [],
      required: true,
    },
  },
  { timestamps: true, collection: COLLECTION_NAME },
);

//Export the model
export default model(DOCUMENT_NAME, keyTokenSchema);
