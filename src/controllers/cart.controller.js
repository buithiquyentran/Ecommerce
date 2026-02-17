import cartService from "../services/cart.service.js";
import { OK } from "../core/success.response.js";
class CartController {
  async createCart(req, res, next) {
    new OK({
      message: "Create cart successfully",
      metadata: await cartService.addToCart(req.body),
    }).send(res);
  }
  async updateCart(req, res, next) {
    new OK({
      message: "Update cart quantity successfully",
      metadata: await cartService.updateProductQuantity(req.body),
    }).send(res);
  }
  async getCartProducts(req, res, next) {
    new OK({
      message: "Get cart products successfully",
      metadata: await cartService.getCartProducts(req.body),
    }).send(res);
  }
  async deleteCart(req, res, next) {
    new OK({
      message: "Delete cart successfully",
      metadata: await cartService.deleteUserCart(req.body.userId),
    }).send(res);
  }
  async removeFromCart(req, res, next) {
    new OK({
      message: "Remove product from cart successfully",
      metadata: await cartService.removeFromCart(req.body),
    }).send(res);
  }
  async clearCart(req, res, next) {
    new OK({
      message: "Clear cart successfully",
      metadata: await cartService.clearCart(req.body.cartId),
    }).send(res);
  }
}
export default new CartController();
