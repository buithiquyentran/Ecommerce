import { checkExist } from "../utils/index.js";
import CartModel from "../models/cart.model.js";
import { badRequestError } from "../core/error.response.js";
class CartService {
  // Update product quantity in cart
  static async updateProductQuantity({ cartId, productId, quantity }) {
    const existingCart = await checkExist({
      filter: { _id: cartId, cart_state: "active" },
      model: CartModel,
    });
    if (!existingCart) {
      throw new badRequestError("Invalid Cart id");
    }
    const foundProduct = existingCart.cart_products.find(
      (product) => product.product_id.toString() === productId,
    );
    if (!foundProduct) {
      throw new badRequestError("Product not found in cart");
    }
    const updateProduct = await CartModel.findOneAndUpdate(
      { _id: cartId, "cart_products.product_id": productId },
      { $set: { "cart_products.$.quantity": quantity } },
      { new: true },
    );
    return updateProduct;
  }
  // 2. Add to cart
  static async addToCart({ userId, product = {} }) {
    const existingCart = await checkExist({
      filter: { cart_userId: userId, cart_state: "active" },
      model: CartModel,
    });
    // If cart doesn't exist, create a new one and add the product to it
    if (!existingCart) {
      const newCart = await CartModel.create({
        cart_userId: userId,
        cart_products: [product],
        cart_count_product: 1,
      });
      return newCart;
    }
    // If cart exists and the cart is empty, add the product to the cart
    if (existingCart.cart_count_product === 0) {
      existingCart.cart_products = [product];
      existingCart.cart_count_product = 1;
      return await existingCart.save();
    }
    const foundProduct = existingCart.cart_products.find(
      (p) => p.product_id.toString() === product.product_id.toString(),
    );

    // If cart exists and the product is already in the cart, update the quantity
    if (foundProduct) {
      return await this.updateProductQuantity({
        cartId: existingCart._id,
        productId: product.product_id,
        quantity: product.quantity,
      });
    } else {
      // If cart exists and the product is not in the cart, add the product to the cart
      return await CartModel.findByIdAndUpdate(
        existingCart._id,
        {
          $push: { cart_products: product },
          $inc: { cart_count_product: 1 },
        },
        { new: true },
      );
    }
  }

  // Get cart by ID
  static async getCartById(cartId) {
    const cart = await checkExist({
      filter: { _id: cartId },
      model: CartModel,
    });
    return cart;
  }
  // Remove product from cart
  static async removeFromCart({ cartId, productId }) {
    const existingCart = await checkExist({
      filter: { _id: cartId, cart_state: "active" },
      model: CartModel,
    });
    if (!existingCart) {
      throw new badRequestError("Invalid Cart id");
    }
    return await CartModel.findByIdAndUpdate(existingCart._id, {
      $pull: { cart_products: { product_id: productId } },
      $inc: { cart_count_product: -1 },
    });
  }

  // Clear cart

  // Get all products in cart

  // Delete cart
}
export default CartService;
