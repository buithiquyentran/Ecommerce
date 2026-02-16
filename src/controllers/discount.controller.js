import discountService from "../services/discount.service.js";
import { OK } from "../core/success.response.js";
class DiscountController {
  async createDiscount(req, res) {
    return new OK({
      message: "Create discount successfully",
      metadata: await discountService.createDiscount({
        discount_shopId: req.user.user,
        ...req.body,
      }),
    }).send(res);
  }

  async updateDiscount(req, res) {
    return new OK({
      message: `Update discount with id ${req.params.discountId} successfully`,
      metadata: await discountService.updateDiscount(req.params.discountId, {
        ...req.body,
        discount_shopId: req.user.user,
      }),
    }).send(res);
  }

  async getProductsByDiscountCode(req, res) {
    const { code } = req.query;
    console.log("req.query in getProductsByDiscountCode", code);
    return new OK({
      message: `Get products by discount code ${code} successfully`,
      metadata: await discountService.getProductsByDiscountCode({
        discount_code: code,
        discount_shopId: req.user.user,
      }),
    }).send(res);
  }
  async getAllDiscountsForShop(req, res) {
    return new OK({
      message: `Get all discounts for shop successfully`,
      metadata: await discountService.getAllDiscountsForShop({
        discount_shopId: req.user.user,
        ...req.query,
      }),
    }).send(res);
  }
  async getDiscountAmount(req, res) {
    const { code } = req.query;
    return new OK({
      message: `Get discount amount for code ${code} successfully`,
      metadata: await discountService.getDiscountAmount({
        ...req.body,
        discount_code: code,
      }),
    }).send(res);
  }
  async deleteDiscount(req, res) {
    const { discountId } = req.params;
    await discountService.deleteDiscount({
      discountId,
      discount_shopId: req.user.user,
    });
    return new OK({
      message: `Delete discount with id ${discountId} successfully`,
    }).send(res);
  }
  async getDiscountById(req, res) {
    const { discountId } = req.params;
    return new OK({
      message: `Get discount with id ${discountId} successfully`,
      metadata: await discountService.getDiscountById({
        discountId,
        shopId: req.user.user,
      }),
    }).send(res);
  }
  async cancelDiscount(req, res) {
    const { discountCode } = req.params;
    const updatedDiscount = await discountService.cancelDiscount({
      discount_code: discountCode,
      discount_shopId: req.user.user,
      userId: req.user.user,
    });
    return new OK({
      message: `Cancel discount with code ${discountCode} successfully`,
      metadata: updatedDiscount,
    }).send(res);
  }
}
export const discountController = new DiscountController();
