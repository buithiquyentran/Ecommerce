import CartModel from "../models/cart.model.js";
import { checkExist } from "../utils/index.js";
import { badRequestError } from "../core/error.response.js";
import { checkProductByServer } from "../models/repositories/product.repo.js";
import discountService from "./discount.service.js";
class checkoutService {
  /*
    {
        cartId, 
        userId, 
        shop_orderIds = [
            {
                shopDiscounts = [{shopId, discountId, discountCode}]
                shopId, 
                products = [
                    {
                        productId, name, price, quantity
                    }
                ]
            }
        ]
    }
  */
  static async checkout({ cartId, userId, shop_orderIds = [] }) {
    const existingCart = await checkExist({
      filter: { _id: cartId, cart_state: "active" },
      model: CartModel,
    });
    if (!existingCart) {
      throw new badRequestError("Invalid Cart id");
    }
    const checkoutOrder = {
        totalPrice: 0, // total raw price before discount
        feeShip: 0, // fee ship
        totalDiscount: 0, // total discount
        totalPayment: 0, // total payment after discount and fee ship
      },
      shop_orderIds_new = [];

    // Calculate total price
    shop_orderIds.forEach((shop_order) => {
      const { shopId, products = [], shopDiscounts = [] } = shop_order;
      const checkProductServer = checkProductByServer({ products });
      if (!checkProductServer[0]) {
        throw new badRequestError("Wrong order, please check your order again");
      }
      const checkoutPrice = checkProductServer.reduce((total, product) => {
        return total + product.price * product.quantity;
      }, 0);
      // Total price before discount
      checkoutOrder.totalPrice += checkoutPrice;
      // Calculate total discount
      const itemCheckout = {
        shopId,
        products,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice, // price after applying discount
        itemProducts: checkProductServer,
      };
      if (shopDiscounts.length > 0) {
        shopDiscounts.forEach((shopDiscount) => {
          const { discountId, discountCode } = shopDiscount;
          const { discount } = discountService.getDiscountAmount({
            discount_code: discountCode,
            userId,
            shopId,
            products: itemCheckout.itemProducts,
          });
          // Apply discount to itemCheckout.priceApplyDiscount
          itemCheckout.priceApplyDiscount -= discount;
        });
        // Update checkoutOrder.totalDiscount
        checkoutOrder.totalDiscount += discount;
      }
      // Calculate fee ship
      // Update checkoutOrder.feeShip
      // Calculate total payment after discount and fee ship
      checkoutOrder.totalPayment += itemCheckout.priceApplyDiscount;
      shop_orderIds_new.push(itemCheckout);
    });
    return {
      ...checkoutOrder,
      shop_orderIds,
      shop_orderIds_new
    };
  }
}
export default checkoutService;
