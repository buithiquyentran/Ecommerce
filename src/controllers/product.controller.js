import productService from "../services/product.service.js";
import { OK } from "../core/success.response.js";
class ProductController {
  async createProduct(req, res, next) {
    new OK({
      message: "Create product successfully",
      metadata: await productService.createProduct(req.body.types, {
        ...req.body,
        shop: req.user.user,
      }),
    }).send(res);
  }

  //UPDATE
  async updateProduct(req, res, next) {
    new OK({
      message: "Update product successfully",
      metadata: await productService.updateProduct({
        types: req.body.types,
        productId: req.params.productId,
        payload: {
          ...req.body,
          shop: req.user.user,
        },
      }),
    }).send(res);
  }

  //PUT
  async publishProductByShop(req, res, next) {
    new OK({
      message: "Publish product successfully",
      metadata: await productService.publishProductByShop({
        shopId: req.user.user,
        productId: req.params.id,
      }),
    }).send(res);
  }
  
  async unPublishProductByShop(req, res, next) {
    new OK({
      message: "Unpublish product successfully",
      metadata: await productService.unPublishProductByShop({
        shopId: req.user.user,
        productId: req.params.id,
      }),
    }).send(res);
  }
  //END PUT

  //QUERY
  /**
   * @desc get all drafts for shop
   * @param {*} req
   * @param {*} res
   * @param {*} next
   */
  async getAllDraftsForShop(req, res, next) {
    new OK({
      message: "Find all drafts for shop successfully",
      metadata: await productService.findAllDraftsForShop({
        shopId: req.user.user,
      }),
    }).send(res);
  }
  async getAllPublishedForShop(req, res, next) {
    new OK({
      message: "Find all published for shop successfully",
      metadata: await productService.findAllPublishedForShop({
        shopId: req.user.user,
      }),
    }).send(res);
  }
  async getListSearchProduct(req, res, next) {
    new OK({
      message: "Find all published for shop successfully",
      metadata: await productService.searchProducts({
        keySearch: req.params.keySearch,
      }),
    }).send(res);
  }
  async getAllProducts(req, res, next) {
    new OK({
      message: "Find all products successfully",
      metadata: await productService.findAllProducts(req.query),
    }).send(res);
  }
  async getProduct(req, res, next) {
    new OK({
      message: "Find product with productId successfully",
      metadata: await productService.findProduct({
        productId: req.params.productId
      }),
    }).send(res);
  }
  //END QUERY
}
export const productController = new ProductController();
