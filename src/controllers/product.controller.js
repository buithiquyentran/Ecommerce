import productService from "../services/product.service.js";
import { OK} from "../core/success.response.js";
class ProductController {
  async createProduct(req, res, next) {
    new OK({
      message: "Create product successfully",
      metadata: await productService.createProduct(req.body.types, {...req.body, shop: req.user.user}),
    }).send(res);
  }
  
}
export const productController = new ProductController();
