import  AccessService from "../services/access.service.js";
import { OK, Created } from "../core/success.response.js";
class AccessController {
  async handleRefreshToken(req, res, next) {
    new OK({
      message: "Get tokens successfully",
      metadata: await AccessService.handleRefreshToken({
        refreshToken: req.refreshToken,
        user : req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  }
  async login(req, res, next) {
    new OK({
      message: "Login successfully",
      metadata: await AccessService.login(req.body),
    }).send(res);
  }
  async logout(req, res, next) {
    new OK({
      message: "Logout successfully",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  }
  // Add methods for access control here
  async signUp(req, res, next) {
    new Created({
      message: "User created successfully",
      metadata: await AccessService.signUp(req.body),
      options: { limit: 10 },
    }).send(res);
  }
}
export const accessController = new AccessController();
