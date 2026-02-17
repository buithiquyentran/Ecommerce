import checkoutService from "../services/checkout.service.js";
import { OK } from "../core/success.response.js";
class CheckoutController {
  async checkoutReview(req, res, next) {
    new OK({
      message: "Create checkout successfully",
      metadata: await checkoutService.checkout(req.body),
    }).send(res);
  }
}
export default new CheckoutController();
