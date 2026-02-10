import {
  productModel,
  clothingModel,
  electronicModel,
} from "../models/product.model.js";
import { badRequestError } from "../core/error.response.js";

class productService {
  static createProduct(types, payload) {
    switch (types) {
      case "Electronic":
        return new Electronic(payload).createProduct();
      case "Clothing":
        return new Clothing(payload).createProduct();
      default:
        throw new badRequestError("Error creating clothing product");
    }
  }
}
class Product {
  constructor({
    name,
    thumb,
    description,
    quantity,
    price,
    types,
    attributes,
    shop,
  }) {
    this.name = name;
    this.thumb = thumb;
    this.description = description;
    this.quantity = quantity;
    this.price = price;
    this.types = types;
    this.attributes = attributes;
    this.shop = shop;
  }
  // create new product
  async createProduct() {
    return await productModel.create(this);
  }
}
// define subclass for different products type Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothingModel.create(this.attributes);
    if (!newClothing) {
      throw new badRequestError("Error creating clothing product");
    }
    const newProduct = await super.createProduct();
    if (!newProduct) {
      throw new badRequestError("Invalid product type");
    }
    return newProduct;
  }
}
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronicModel.create(this.attributes);
    if (!newElectronic) {
      throw new badRequestError(`Error creating electronic product ${type}`);
    }
    const newProduct = await super.createProduct();
    if (!newProduct) {
      throw new badRequestError("Error creating product");
    }
    return newProduct;
  }
}
export default productService;
