import inventoryModel from "../inventory.model.js";

// Persist a new inventory record for a product
async function insertInventory({ productId, shopId, stock, location = "unKnown" }) {
  const newInventory = await inventoryModel.create({
    inven_productId: productId,
    inven_shopId: shopId,
    inven_stock: stock,
    inven_location: location,
  });
  return newInventory;
}

export { insertInventory };