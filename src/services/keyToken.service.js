import { Types } from "mongoose";
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
  static findByUserId = async (userId) => {
    return await keyTokenModel
      .findOne({ user: new Types.ObjectId(userId) })
      .lean();
  };
  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne({ _id: new Types.ObjectId(id) });
  };

  static removeKeyByUserId = async (userId) => {
    return await keyTokenModel.deleteOne({ user: userId });
  };
  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel
      .findOne({ refreshTokensUsed: refreshToken })
      .lean();
  };
  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel
      .findOne({ refreshToken })
      .lean();
  };
}

export default keyTokenService;
