
import { Schema, model } from "mongoose";
const COLLECTION_NAME = "ApiKeys";
const DOCUMENT_NAME = "ApiKey";
var ApiKeySchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    permissions: {
      type: [String],
      enum: ["000" , "111", "222"],
      required: true,
    },
  },
  { timestamps: true, collection: COLLECTION_NAME },
);

//Export the model
export default model(DOCUMENT_NAME, ApiKeySchema);
