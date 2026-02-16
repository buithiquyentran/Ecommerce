import discountModel from "../discount.model.js";

async function discountExist({filter}) {
  return await discountModel.findOne(filter).lean().exec();
}
async function discountExistById(discountId) {
  return await discountModel.findById(discountId).lean().exec();
}

export { discountExist, discountExistById };
