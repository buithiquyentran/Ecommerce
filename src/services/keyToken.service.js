import keyTokenModel from "../models/keytoken.model.js";
class keyTokenService {
  static createKeyToken = async ({ user, publicKey }) => {
    try {
      const publicKeyString = publicKey.toString();
      const keyToken = await keyTokenModel.create({
        user,
        publicKey: publicKeyString,
      });
      return keyToken ? keyToken.publicKey : null;
    } catch (error) {
      return error;
    }
  };
}

export default keyTokenService;
