import { accessService } from "../services/access.service.js";
import { OK, Created } from "../core/success.response.js";
class AccessController {
  // Add methods for access control here
  async signUp(req, res, next) {
    new Created({
      message: "User created successfully",
      metadata: await accessService.signUp(req.body),
      options: { limit: 10 },
    }).send(res);

    // return res.status(201).json(await accessService.signUp(req.body));
  }
}
export const accessController = new AccessController();
