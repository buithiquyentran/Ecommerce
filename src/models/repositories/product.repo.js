import { Types } from "mongoose";
import {
  productModel,
  clothingModel,
  electronicModel,
  furnitureModel,
} from "../product.model.js";
import { badRequestError } from "../../core/error.response.js";
import { getSelectData, unGetSelectData } from "../../utils/index.js";

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

const searchProductsByUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await productModel
    .find(
      { isPublished: true, $text: { $search: regexSearch } },
      { score: { $meta: "textScore" } },
    )
    .sort({ score: { $meta: "textScore" } })
    .lean()
    .exec();
  return results;
};

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
    { $set: { isDraft: false, isPublished: true } },
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
async function findAllProducts({ sort, limit, page, filter, select }) {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { createdAt: -1 } : { updatedAt: -1 };
  select = getSelectData(select);
  return await productModel
    .find(filter)
    .populate("shop", "name email -_id")
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(select)
    .lean()
    .exec();
}
async function findProduct({ productId, select = [], unsSelect = [] }) {
  if (unsSelect.length > 0) {
    select = unGetSelectData(unsSelect);
  } else {
    select = getSelectData(select);
  }
  const product = await productModel.findById(productId).select(select);
  return product;
}
async function updateProductById({ productId, payload, model, isNew = true }) {
  return await model.findByIdAndUpdate(productId, payload, { new: isNew });
}
export {
  queryProduct,
  publishProductByShop,
  unPublishProductByShop,
  searchProductsByUser,
  findAllProducts,
  findProduct,
  updateProductById,
};
