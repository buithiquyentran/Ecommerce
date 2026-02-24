
import InventoryModel from "../models/inventory.model.js";
import {productModel} from "../models/product.model.js";
import { checkExist } from "../utils/index.js";
import { badRequestError } from "../core/error.response.js";
class inventoryService {
  static async addStockInventory({ productId, shopId, location ="unknown",  quantity }) {
    const product = await checkExist({ filter: { _id: productId }, model: productModel });
    if (!product) {
      throw new badRequestError("Invalid product id");
    }
    const query = {
      inven_productId: productId,
      inven_shopId: shopId,
      inven_location: location,
    }, updateSet = {
      $inc: { inven_stock: quantity },
    }, options = { upsert: true, new: true };
    return await InventoryModel.findOneAndUpdate(query, updateSet, options).lean().exec();

  }
}
export default inventoryService;
