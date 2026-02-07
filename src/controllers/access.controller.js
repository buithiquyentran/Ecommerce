import { accessService } from "../services/access.service.js";
class AccessController {
  // Add methods for access control here
  async signUp(req, res, next) {
      return res.status(201).json(await accessService.signUp(req.body));
  }
}
export const accessController = new AccessController();
