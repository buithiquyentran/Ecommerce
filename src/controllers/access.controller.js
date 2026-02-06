import { accessService } from "../services/access.service.js";
class AccessController {
  // Add methods for access control here
  async signUp(req, res, next) {
    try {
      // Logic for signing up a user
      console.log(`[P]::signUp::`, req.body);
      return res.status(201).json(await accessService.signUp(req.body));
    } catch (error) {
      next(error);
    }
  }
}
export const accessController = new AccessController();
