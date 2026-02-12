"use strict";
//!dmbg
import slugify from "slugify";
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
    slug: {
      type: String,
      index: true,
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      max: [5, "Rating must be below 5.0"],
    },
    productVariations: {
      type: Array,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true,
      select: false,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
      select: false,
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
  },
  { timestamps: true, collection: COLLECTION_NAME },
);

//Document middleware - run before save or create
productSchema.pre("save", function () {
  // Only regenerate slug when name exists and changed/new
  if (this.name && (this.isNew || this.isModified("name"))) {
    this.slug = slugify(this.name, { lower: true });
  }
});

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
