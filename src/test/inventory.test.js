import RedisPubSubService from "../services/redisPubsub.service.js";

class inventoryTestService {
  constructor() {
    this.init();
  }

  async init() {
    await RedisPubSubService.subscribe("purchase_channel", (message) => {
      inventoryTestService.updateInventory(message);
    });
    console.log("Inventory subscriber is ready");
  }

  static updateInventory(message) {
    const order = JSON.parse(message);
    console.log(
      `Updating inventory for product ${order.productId} with quantity ${order.quantity}`,
    );
  }
}
export default new inventoryTestService();
