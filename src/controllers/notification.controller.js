import notificationService from "../services/notification.service.js";
import { OK } from "../core/success.response.js";
class notificationController {
  async getListNotiByUser(req, res, next) {
    new OK({
      message: "Get list notifications successfully",
      metadata: await notificationService.getListNotiByUser(req.query),
    }).send(res);
  }
}
export default new notificationController();
