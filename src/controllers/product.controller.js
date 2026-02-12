import productService from "../services/product.service.js";
import { OK} from "../core/success.response.js";
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
  //END QUERY
}
export const productController = new ProductController();
