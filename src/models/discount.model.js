import { Schema, model } from "mongoose";
const COLLECTION_NAME = "Discounts";
const DOCUMENT_NAME = "Discount";
var DiscountSchema = new Schema(
  {
    discount_name: {
      type: String,
      required: true,
    },
    discount_description: {
      type: String,
      required: true,
    },
    discount_type: {
      type: String,
      required: true,
      enum: ["percentage", "fixed_amount"],
    },
    discount_value: {
      // 10.000 for fixed amount or 10 for percentage
      type: Number,
      required: true,
    },
    discount_code: {
      // unique code for the discount
      type: String,
      required: true,
    },
    discount_startDate: {
      type: Date,
      required: true,
    },
    discount_endDate: {
      type: Date,
      required: true,
    },
    discount_max_uses: {
      // total number of times the discount can be used
      type: Number,
      required: true,
    },
    discount_used_count: {
      // number of times the discount has been used
      type: Number,
      required: true,
      default: 0,
    },
    discount_max_uses_per_user: {
      // number of times a single user can use the discount
      type: Number,
      required: true,
    },
    discount_users_used: {
      // list of user IDs who have used the discount (to enforce max uses per user)
      type: Array,
      default: [],
    },
    discount_min_order_value: {
      // minimum order value to apply the discount
      type: Number,
      required: true,
    },
    discount_shopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      default: true,
    },

    discount_active: {
      // is the discount currently active
      type: Boolean,
      required: true,
      default: true,
    },
    discount_appliedTo: {
      // whether the discount applies to all products or specific products
      type: String,
      required: true,
      enum: ["all", "specific"],
    },
    discount_product_ids: {
      // list of product IDs the discount applies to (if discount_appliedTo is "specific")
      type: [Schema.Types.ObjectId],
      ref: "Product",
      default: [],
    },
  },
  { timestamps: true, collection: COLLECTION_NAME },
);

//Export the model
export default model(DOCUMENT_NAME, DiscountSchema);
