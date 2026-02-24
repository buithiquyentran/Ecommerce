import inventoryService from "../services/inventory.service.js";
import { OK } from "../core/success.response.js";
class inventoryController {
  async inventoryReview(req, res, next) {
    new OK({
      message: "Add stock successfully",
      metadata: await inventoryService.addStockInventory(req.body),
    }).send(res);
  }
}
export default new inventoryController();
