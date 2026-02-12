import { productModel, clothingModel, electronicModel, furnitureModel } from "../product.model.js";

async function findAllDraftsForShop({ query, limit = 50, skip = 0 }) {
    return await productModel
      .find( query)
      .populate("shop", "name email -_id")
      .sort({ updatedAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean()
      .exec();
  }


export { findAllDraftsForShop };