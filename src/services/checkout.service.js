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
    let checkoutOrder = {
        totalPrice: 0, // total raw price before discount
        feeShip: 0, // fee ship
        totalDiscount: 0, // total discount
        totalPayment: 0, // total payment after discount and fee ship
      },
      shop_orderIds_new = [];

    // Calculate total price
    for (const shop_order of shop_orderIds) {
      const { shopId, products = [], shopDiscounts = [] } = shop_order;
      console.log("products: ", products);
      const checkProductServer = await checkProductByServer({ products });
      console.log("checkProductServer: ", checkProductServer);
      if (!checkProductServer[0]) {
        throw new badRequestError("Wrong order, please check your order again");
      }
      const checkoutPrice = checkProductServer.reduce((total, product) => {
        return total + product.price * product.quantity;
      }, 0);
      // Total price before discount
      checkoutOrder.totalPrice += checkoutPrice;
      // Calculate total discount
      let itemCheckout = {
        shopId,
        products,
        priceRaw: checkoutPrice,
        priceApplyDiscount: checkoutPrice, // price after applying discount
        itemProducts: checkProductServer,
      };
      if (shopDiscounts.length > 0) {
        for (const shopDiscount of shopDiscounts) {
          const { shopId, discountId, discountCode } = shopDiscount;
          const { totalOrder, discount, totalPrice } =
            await discountService.getDiscountAmount({
              discount_code: discountCode,
              discountId,
              userId,
              shopId,
              products: itemCheckout.itemProducts,
            });
          console.log("total discount: ", totalOrder, discount, totalPrice);
          // Apply discount to itemCheckout.priceApplyDiscount
          itemCheckout.priceApplyDiscount -= discount;
          // Update checkoutOrder.totalDiscount
          checkoutOrder.totalDiscount += discount;
        }
      }
      // Calculate fee ship
      // Update checkoutOrder.feeShip
      // Calculate total payment after discount and fee ship
      checkoutOrder.totalPayment += itemCheckout.priceApplyDiscount;
      shop_orderIds_new.push(itemCheckout);
    }
    return {
      checkoutOrder,
      shop_orderIds,
      shop_orderIds_new,
    };
  }
  static async orderByUser({
    userId,
    cardId,
    shop_orderIds = [],
    user_address = {},
    userPayment = {},
  }) {
    const { checkoutOrder, shop_orderIds_new } = await this.checkout({
      cartId: cardId,
      userId,
      shop_orderIds: shop_orderIds,
    });
    // Get new array products 
    const products = shop_orderIds_new.flatMap((shop_order) => shop_order.itemProducts);
    console.log("[1]:: products: ", products);
    for (let i=0;i<products.length;i++) {
      const {productId, quantity} = products[i];
    }
    // Update inventory, etc.
    return {
      checkoutOrder,
      shop_orderIds_new,
    };
  }
}

export default checkoutService;
