import RedisPubSubService from "../services/redisPubsub.service.js";

class productTestService {
  async purchaseProduct(productId, quantity) {
    const order = {
      productId,
      quantity,
    };
    console.log(`Publishing order for product ${productId} with quantity ${quantity}`);
    await RedisPubSubService.publish("purchase_channel", JSON.stringify(order));
  }
}
export default new productTestService();
