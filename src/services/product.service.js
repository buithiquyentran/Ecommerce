import {
  productModel,
  clothingModel,
  electronicModel,
  furnitureModel,
} from "../models/product.model.js";
import { badRequestError } from "../core/error.response.js";
import ProductTypes from "./product.config.js";
import {
  queryProduct,
  publishProductByShop,
  unPublishProductByShop,
  searchProductsByUser,
} from "../models/repositories/product.repo.js";
class productService {
  static productRegistry = {};
  static registerProductType(type, classRef) {
    this.productRegistry[type] = classRef;
  }
  static createProduct(types, payload) {
    const classRef = this.productRegistry[types];
    if (!classRef) {
      throw new badRequestError(`Invalid product type: ${types}`);
    }
    return new classRef(payload).createProduct();
  }

  //PUT
  static async publishProductByShop({ shopId, productId }) {
    return await publishProductByShop({ shopId, productId });
  }
  static async unPublishProductByShop({ shopId, productId }) {
    return await unPublishProductByShop({ shopId, productId });
  }

  //END PUT

  // query
  static async searchProducts({ keySearch }) {
    return await searchProductsByUser({ keySearch });
  }

  static async findAllDraftsForShop({ shopId, limit = 50, skip = 0 }) {
    const query = { shop: shopId, isDraft: true };
    return await queryProduct({ query, limit, skip });
  }
  static async findAllPublishedForShop({ shopId, limit = 50, skip = 0 }) {
    const query = { shop: shopId, isPublished: true };
    return await queryProduct({ query, limit, skip });
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
    isDraft,
    isPublished,
    shop,
  }) {
    this.name = name;
    this.thumb = thumb;
    this.description = description;
    this.quantity = quantity;
    this.price = price;
    this.types = types;
    this.attributes = attributes;
    this.isDraft = isDraft;
    this.isPublished = isPublished;
    this.shop = shop;
  }
  // create new product
  async createProduct(productId) {
    return await productModel.create({ ...this, _id: productId });
  }
}
// define subclass for different products type Clothing
class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothingModel.create({
      ...this.attributes,
      shop: this.shop,
    });
    console.log("newClothing", newClothing);

    if (!newClothing) {
      throw new badRequestError("Error creating clothing product");
    }
    const newProduct = await super.createProduct(newClothing._id);
    console.log("newProduct", newProduct);

    if (!newProduct) {
      throw new badRequestError("Invalid product type");
    }
    return newProduct;
  }
}
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronicModel.create({
      ...this.attributes,
      shop: this.shop,
    });
    console.log("newElectronic", newElectronic);
    if (!newElectronic) {
      throw new badRequestError(`Error creating electronic product ${type}`);
    }
    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct) {
      throw new badRequestError("Error creating product");
    }
    return newProduct;
  }
}
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furnitureModel.create({
      ...this.attributes,
      shop: this.shop,
    });
    if (!newFurniture) {
      throw new badRequestError("Error creating furniture product");
    }
    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct) {
      throw new badRequestError("Invalid product type");
    }
    return newProduct;
  }
}
productService.registerProductType(ProductTypes.CLOTHING, Clothing);
productService.registerProductType(ProductTypes.ELECTRONICS, Electronic);
productService.registerProductType(ProductTypes.FURNITURE, Furniture);
export default productService;
