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
import { badRequestError } from "../core/error.response.js";
import { convertToObjectId } from "../utils/index.js";
import discountModel from "../models/discount.model.js";
import { findAllProducts } from "../models/repositories/product.repo.js";
import { findAllUnselect } from "../utils/index.js";
import {
  discountExist,
  discountExistById,
} from "../models/repositories/discount.repo.js";
import {
  removeUndefinedObject,
  updateNestedObjectParser,
} from "../utils/index.js";
import { findProduct } from "../models/repositories/product.repo.js";
class discountService {
  static async createDiscount(payload) {
    const {
      discount_name,
      discount_description,
      discount_type,
      discount_value,
      discount_code,
      discount_startDate,
      discount_endDate,
      discount_max_uses,
      discount_max_uses_per_user,
      discount_min_order_value,
      discount_appliedTo,
      discount_shopId,
      discount_product_ids,
    } = payload;
    if (new Date(discount_startDate) >= new Date(discount_endDate)) {
      throw new badRequestError("End date must be after start date");
    }
    if (new Date() >= new Date(discount_endDate)) {
      throw new badRequestError("Discount has expired");
    }
    const foundDiscount = await discountExist({
      filter: { discount_code, discount_shopId },
    });
    if (foundDiscount) {
      throw new badRequestError("Discount code already exists");
    }
    const newDiscount = await discountModel.create({
      discount_name: discount_name,
      discount_description: discount_description,
      discount_type: discount_type,
      discount_value: discount_value,
      discount_code: discount_code,
      discount_startDate: new Date(discount_startDate),
      discount_endDate: new Date(discount_endDate),
      discount_max_uses: discount_max_uses,
      discount_max_uses_per_user: discount_max_uses_per_user,
      discount_min_order_value: discount_min_order_value,
      discount_shopId: convertToObjectId(discount_shopId),
      discount_appliedTo: discount_appliedTo,
      discount_product_ids: discount_product_ids || [],
    });
    return newDiscount;
  }
  /*
    data to test createDiscount method
    {
      "discount_name": "Summer Sale",
      "discount_description": "Get 20% off on all products during our summer sale!",
      "discount_type": "percentage",
      "discount_value": 20,
      "discount_code": "SUMMER20",
      "discount_startDate": "2024-07-01T00:00:00.000Z",
      "discount_endDate": "2024-07-31T23:59:59.000Z",
      "discount_max_uses": 100,
      "discount_max_uses_per_user": 2,
      "discount_min_order_value": 50,
      "discount_appliedTo": "all",
      "discount_product_ids": [],
      
    }
  */

  static async updateDiscount(discountId, payload) {
    const foundDiscount = await discountExistById(discountId);
    if (!foundDiscount) {
      throw new badRequestError("Invalid discount id");
    }
    //remove atr has null/undefined
    const objectParams = removeUndefinedObject(payload);
    console.log("objectParams after removeUndefinedObject", objectParams);
    //Check where to update (product, attributes)
    const updatedDiscount = await discountModel.findByIdAndUpdate(
      discountId,
      updateNestedObjectParser(objectParams),
    );
    return updatedDiscount;
  }
  //Get list products by discount code
  static async getProductsByDiscountCode({
    discount_code,
    discount_shopId,
    userId,
    limit,
    page,
  }) {
    // Find discount by code
    const foundDiscount = await discountModel.findOne({
      discount_code: discount_code,
      discount_shopId: convertToObjectId(discount_shopId),
      discount_active: true,
    });
    if (!foundDiscount) {
      throw new badRequestError("Invalid discount code");
    }
    const { discount_appliedTo, discount_product_ids } = foundDiscount;
    if (discount_appliedTo === "all") {
      const products = await findAllProducts({
        limit: +limit,
        page: +page,
        filter: { shop: convertToObjectId(discount_shopId), isPublished: true },
        select: ["name"],
      });
      return products;
    } else if (discount_appliedTo === "specific") {
      const products_ids = discount_product_ids.map((id) =>
        convertToObjectId(id),
      );
      console.log("products_ids in getProductsByDiscountCode", products_ids);
      const products = await findAllProducts({
        limit: +limit,
        page: +page,
        filter: {
          shop: convertToObjectId(discount_shopId),
          _id: { $in: products_ids },
        },
        select: ["name"],
      });
      return products;
    }
  }
  // get all discounts for shop
  static async getAllDiscountsForShop({ discount_shopId, limit, page }) {
    const discounts = await findAllUnselect({
      sort: "ctime",
      limit: +limit,
      page: +page,
      filter: { discount_shopId: convertToObjectId(discount_shopId) },
      unselect: ["discount_used_count", "discount_product_ids", "__v"],
      model: discountModel,
    });
    return discounts;
  }

  // get discound_amount by code (Apply discount code)
  static async getDiscountAmount({
    discount_code,
    discountId,
    userId,
    shopId,
    products,
  }) {
    const foundDiscount = await discountExist({
      filter: {
        discount_code,
        discount_shopId: convertToObjectId(shopId),
        _id: convertToObjectId(discountId),
      },
    });
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
      discount_appliedTo,
      discount_product_ids,
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
      (total, product) => total + product.price * product.quantity,
      0,
    );
    let discountAmount = 0;
    // check if discount applies to specific products and if the order contains any of those products
    if (discount_appliedTo == "specific") {
      let totalPriceHasDiscount = 0;
      for (const product of products) {
        console.log("product in getDiscountAmount", product);
        const isProductInDiscount = discount_product_ids.find(
          (id) => id.toString() == product._id,
        );
        if (isProductInDiscount) {
          totalPriceHasDiscount += product.price * product.quantity;
          discountAmount +=
            discount_type === "percentage"
              ? (product.price * product.quantity * discount_value) / 100
              : discount_value;
        }
      }
      console.log(
        "totalPriceHasDiscount in getDiscountAmount",
        totalPriceHasDiscount,
      );
      if (
        discount_min_order_value &&
        totalPriceHasDiscount < discount_min_order_value
      ) {
        throw new badRequestError(
          "Discount code is not applicable to any products in the order",
        );
      }
    } else if (discount_appliedTo == "all") {
      if (
        discount_min_order_value &&
        totalOrderValue < discount_min_order_value
      ) {
        throw new badRequestError(
          "Discount code is not applicable to this order value",
        );
      }
    }

    // calculate discount amount
    if (discount_appliedTo === "all") {
      if (discount_type === "percentage") {
        discountAmount = (totalOrderValue * discount_value) / 100;
      } else if (discount_type === "fixed_amount") {
        discountAmount = discount_value;
      }
    }
    //
    return {
      totalOrder: totalOrderValue,
      discount: discountAmount,
      totalPrice: totalOrderValue - discountAmount,
    };
  }
  /*
  data to test discount amount:
  {
    "discount_code": "SUMMER20",
    "userId": "64a7cbbf1c4e5b2a5c8d9e7f",
    "discount_shopId": "64a7cbbf1c4e5b2a5c8d9e7e",
    "discount_products": [
      {
        "name": "Product 1",
        "price": 100  
      },
  */
  // delete discount
  static async deleteDiscount({ discountId, discount_shopId }) {
    const _id = convertToObjectId(discountId);
    console.log(
      "id, discount_shopId in deleteDiscount",
      discountId,
      discount_shopId,
    );
    const foundDiscount = await discountExist({
      filter: {
        _id: _id,
        discount_shopId: convertToObjectId(discount_shopId),
      },
    });
    if (!foundDiscount) {
      throw new badRequestError("Discount not found");
    }
    const deletedDiscount = await discountModel.findByIdAndDelete(_id);
    return deletedDiscount;
  }
  static async getDiscountById({ discountId, shopId }) {
    const _id = convertToObjectId(discountId);
    console.log("id, shopId in getDiscountById", discountId, shopId);
    const foundDiscount = await discountExist({
      filter: {
        _id,
        discount_shopId: convertToObjectId(shopId),
      },
    });
    if (!foundDiscount) {
      throw new badRequestError("Discount not found");
    }
    return foundDiscount;
  }
  // user cancel discount (from use to not use discount)
  static async cancelDiscount({ discount_code, userId, discount_shopId }) {
    const foundDiscount = await discountExist({
      filter: {
        discount_code: discount_code,
        discount_shopId: convertToObjectId(discount_shopId),
      },
    });
    if (!foundDiscount) {
      throw new badRequestError("Invalid discount code");
    }
    return await discountModel.findByIdAndUpdate(foundDiscount._id, {
      $inc: { discount_used_count: -1, discount_max_uses: 1 },
      $pull: { discount_users_used: userId },
    });
  }
}
export default discountService;
