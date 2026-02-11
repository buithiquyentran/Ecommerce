//!dmbg
import { Schema, Types, model } from "mongoose";
const COLLECTION_NAME = "Products";
const DOCUMENT_NAME = "Product";

var productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    thumb: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    quantity: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    types: {
      type: String,
      enum: ["Electronics", "Clothing", "Furniture"],
    },
    attributes: {
      type: Schema.Types.Mixed,
      required: true,
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
  },
  { timestamps: true, collection: COLLECTION_NAME },
);
const clothingSchema = new Schema(
  {
    brand: {
      type: String,
    },
    size: {
      type: String,
    },
    material: {
      type: String,
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "Clothing",
  },
);
const electronicSchema = new Schema(
  {
    manufacturer: {
      type: String,
    },
    model: {
      type: String,
    },
    color: {
      type: String,
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "Electronics",
  },
);
const furnitureSchema = new Schema(
  {
    brand: {
      type: String,
    },
    size: {
      type: String,
    },
    material: {
      type: String,
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "Furniture",
  },
);
const productModel = model(DOCUMENT_NAME, productSchema);
const clothingModel = model("Clothing", clothingSchema);
const electronicModel = model("Electronic", electronicSchema);
const furnitureModel = model("Furniture", furnitureSchema);
//Export the model
export { productModel, clothingModel, electronicModel, furnitureModel };
