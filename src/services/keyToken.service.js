import keyTokenModel from "../models/keytoken.model.js";
class keyTokenService {
  static createKeyToken = async ({ user, keyAccess, keyRefresh }) => {
    try {
      const keyToken = await keyTokenModel.create({
        user,
        keyAccess,
        keyRefresh,
      });
      return keyToken;
    } catch (error) {
      return error;
    }
  };
}

export default keyTokenService;
