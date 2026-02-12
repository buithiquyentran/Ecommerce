import { Types } from "mongoose";
import {
  productModel,
  clothingModel,
  electronicModel,
  furnitureModel,
} from "../product.model.js";
import { badRequestError } from "../../core/error.response.js";

async function queryProduct({ query, limit = 50, skip = 0 }) {
  return await productModel
    .find(query)
    .populate("shop", "name email -_id")
    .sort({ updatedAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean()
    .exec();
}

async function publishProductByShop({ shopId, productId }) {
  const foundProduct = await productModel.findOne({
    _id: new Types.ObjectId(productId),
    shop: new Types.ObjectId(shopId),
  });
  if (!foundProduct) {
    return null;
  }
  // Persist publish state using model update (document.update is deprecated)
  const { modifiedCount } = await productModel.updateOne(
    { _id: foundProduct._id },
    { $set: { isDraft: false, isPublished: true } }
  );
  return modifiedCount;
}

async function unPublishProductByShop({ shopId, productId }) {
  const foundProduct = await productModel.findOne({
    _id: new Types.ObjectId(productId),
    shop: new Types.ObjectId(shopId),
  });
  if (!foundProduct) {
    return null;
  }
  // Persist publish state using model update (document.update is deprecated)
  const { modifiedCount } = await productModel.updateOne(
    { _id: foundProduct._id },
    { $set: { isDraft: false, isPublished: false } },
  );
  return modifiedCount;
}

export { queryProduct, publishProductByShop, unPublishProductByShop };
