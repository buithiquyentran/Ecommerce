import inventoryModel from "../inventory.model.js";
import {convertToObjectId} from "../../utils/index.js";
// Persist a new inventory record for a product
async function insertInventory({
  productId,
  shopId,
  stock,
  location = "unKnown",
}) {
  const newInventory = await inventoryModel.create({
    inven_productId: productId,
    inven_shopId: shopId,
    inven_stock: stock,
    inven_location: location,
  });
  return newInventory;
}

async function reservationInventory({ productId, shopId, quantity, cardId }) {
  const query = {
      inven_productId: convertToObjectId(productId),
      inven_stock: { $gte: quantity },
    },
    update = {
      $push: {
        inven_reservation: {
          cardId,
          quantity,
          updatedAt: new Date(),
        },
      },
      $inc: {
        inven_stock: -quantity,
      },

    },options = {
      update: true,
      new: true, // Return the updated document
    };
  return await inventoryModel.findOneAndUpdate(query, update, options);
}
export { insertInventory, reservationInventory };
