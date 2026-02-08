import keyTokenModel from "../models/keytoken.model.js";
class keyTokenService {
  static createKeyToken = async ({
    user,
    keyAccess,
    keyRefresh,
    refreshToken,
  }) => {
    try {
      const filter = { user: user };
      const update = {
        keyAccess,
        keyRefresh,
        refreshTokensUsed: [],
        refreshToken,
      };
      const options = { new: true, upsert: true };
      const keyToken = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options,
      );
      return keyToken ? keyToken.keyAccess : null;
    } catch (error) {
      return error;
    }
  };
}

export default keyTokenService;
