/*
   Discount Service
    1. Create Discount (Shop, Admin)
    2. Get discount amount
    3. Get all discounts (Shop, Admin)
    4. Update Discount (Shop, Admin)
    5. Delete Discount (Shop, Admin)
    6. Cancle Discount (Shop, Admin)
    7. Verify Discount Code (User)

 */
import { badRequestError } from "../core/errors/index.js";
import { convertToObjectId } from "../utils/index.js";
import discountModel from "../models/discount.model.js";
import { findAllProducts } from "../models/repositories/product.repo.js";
import discountModel from "../models/discount.model.js";
import { findAllUnselect } from "../utils/index.js";
import {
  discountExist,
  discountExistById,
} from "../models/repositories/discount.repo.js";
class discountService {
  static async createDiscount(payload) {
    const {
      name,
      description,
      type,
      value,
      code,
      startDate,
      endDate,
      max_uses,
      max_uses_per_user,
      min_order_value,
      shopId,
      appliedTo,
      produc_ids,
    } = payload;
    if (new Date(startDate) >= new Date(endDate)) {
      throw new badRequestError("End date must be after start date");
    }
    if (new Date() >= new Date(endDate)) {
      throw new badRequestError("Discount has expired");
    }
    const foundDiscount = await discountExist(code, shopId);
    if (foundDiscount) {
      throw new badRequestError("Discount code already exists");
    }
    const newDiscount = await discountModel.create({
      discount_name: name,
      discount_description: description,
      discount_type: type,
      discount_value: value,
      discount_code: code,
      discount_startDate: new Date(startDate),
      discount_endDate: new Date(endDate),
      discount_max_uses: max_uses,
      discount_max_uses_per_user: max_uses_per_user,
      discount_min_order_value: min_order_value,
      discount_shopId: convertToObjectId(shopId),
      discount_appyTo: appliedTo,
      discount_produc_ids: produc_ids || [],
    });
    return newDiscount;
  }
  static async updateDiscount(discountId, payload) {
    //emove atr has null/undefined
    const objectParams = removeUndefinedObject(payload);
    //Check where to update (product, attributes)
    const updatedDiscount = await discountModel.findByIdAndUpdate(
      discountId,
      updateNestedObjectParser(objectParams),
    );
    return updatedDiscount;
  }
  //Get list products by discount code
  static async getProductsByDiscountCode({
    discountCode,
    shopId,
    userId,
    limit,
    page,
  }) {
    // Find discount by code
    const foundDiscount = await discountModel.findOne({
      discount_code: discountCode,
      discount_active: true,
    });
    if (!foundDiscount) {
      throw new badRequestError("Invalid discount code");
    }
    const { discount_appliedTo, discount_produc_ids } = foundDiscount;
    if (discount_appliedTo === "all") {
      const products = await findAllProducts({
        limit: +limit,
        page: +page,
        filter: { shop: convertToObjectId(shopId), isPublished: true },
        select: ["name"],
      });
      return products;
    } else if (discount_appliedTo === "specific") {
      const products = await findAllProducts({
        limit: +limit,
        page: +page,
        filter: {
          shop: convertToObjectId(shopId),
          _id: { $in: discount_produc_ids },
        },
        select: ["name"],
      });
      return products;
    }
  }
  // get all discounts for shop
  static async getAllDiscountsForShop({ shopId, limit, page }) {
    const discounts = await findAllUnselect({
      sort: "ctime",
      limit: +limit,
      page: +page,
      filter: { discount_shopId: convertToObjectId(shopId) },
      unselect: ["discount_used_count", "discount_produc_ids", "__v"],
      model: discountModel,
    });
    return discounts;
  }

  // get discound_amount by code (Apply discount code)
  static async getDiscountAmount({ discountCode, userId, shopId, products }) {
    const foundDiscount = await discountExist(
      (filter = {
        discount_code: discountCode,
        discount_shopId: convertToObjectId(shopId),
      }),
    );
    if (!foundDiscount) {
      throw new badRequestError("Invalid discount code");
    }
    const {
      discount_active,
      discount_type,
      discount_value,
      discount_startDate,
      discount_endDate,
      discount_max_uses,
      discount_used_count,
      discount_max_uses_per_user,
      discount_users_used,
      discount_min_order_value,
    } = foundDiscount;
    // Check if discount is active
    if (!discount_active)
      throw new badRequestError("Discount code is not active");
    // Check if discount is expired
    if (
      new Date() < new Date(discount_startDate) ||
      new Date() > new Date(discount_endDate)
    )
      throw new badRequestError("Discount code has expired");
    if (!discount_max_uses || discount_used_count >= discount_max_uses) {
      throw new badRequestError("Discount code has reached maximum uses");
    }
    //check user max uses
    if (discount_max_uses_per_user) {
      const userUserCount = discount_users_used.filter(
        (user) => user.toString() === userId.toString(),
      ).length;

      if (userUserCount >= discount_max_uses_per_user) {
        throw new badRequestError(
          "You have reached the maximum uses for this discount code",
        );
      }
    }
    // check min order value
    const totalOrderValue = products.reduce(
      (total, product) => total + product.price,
      0,
    );
    if (
      discount_min_order_value &&
      totalOrderValue < discount_min_order_value
    ) {
      throw new badRequestError(
        "Discount code is not applicable to this order value",
      );
    }
    // calculate discount amount
    let discountAmount = 0;
    if (discount_type === "percentage") {
      discountAmount = (totalOrderValue * discount_value) / 100;
    } else if (discount_type === "fixed_amount") {
      discountAmount = discount_value;
    }
    return {
      totalOrder: totalOrderValue,
      discount: discountAmount,
      totalPrice: totalOrderValue - discountAmount,
    };
  }

  // delete discount
  static async deleteDiscount(discountId) {
    const foundDiscount = await discountExist(
      (filter = {
        _id: discountId
      }),
    );
    if (!foundDiscount) {
      throw new badRequestError("Discount not found");
    }
    const deletedDiscount = await discountModel.findByIdAndDelete(discountId);
    return deletedDiscount;
  }

  // user cancel discount (from use to not use discount)
  static async cancelDiscount({ discountCode, userId, shopId }) {
    const foundDiscount = await discountExist(
      (filter = {
        discount_code: discountCode,
        discount_shopId: convertToObjectId(shopId),
      }),
    );  
    if (!foundDiscount) {
      throw new badRequestError("Invalid discount code");
    }
    return await discountModel.findByIdAndUpdate(
      foundDiscount._id,
      {
        $inc: { discount_used_count: -1 },
        $pull: { discount_users_used: userId },
      },
      { new: true },
    );
  } 
}
export default discountService;
