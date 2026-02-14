import discountModel from "../schemas/discount.schema.js";
import { convertToObjectId } from "../../utils/index.js";

async function discountExist({filter}) {
  return await discountModel.findOne(filter);
}
async function discountExistById(discountId) {
  return await discountModel.findById(discountId);
}

export { discountExist, discountExistById };
