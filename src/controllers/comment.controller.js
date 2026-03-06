import commentService from "../services/comment.service.js";
import { OK } from "../core/success.response.js";
class commentController {
  async createComment(req, res, next) {
    new OK({
      message: "Add comment successfully",
      metadata: await commentService.createComment(req.body),
    }).send(res);
  }
}
export default new commentController();
