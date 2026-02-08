import ShopModel from "../models/shop.model.js";
import * as crypto from "node:crypto";
import bcypt from "bcrypt";
import { createTokenPair } from "../auth/authUtils.js";
import keyTokenService from "./keyToken.service.js";
import { getInforData } from "../utils/index.js";
import { badRequestError, authFailureError } from "../core/error.response.js";
import { findByEmail } from "./shop.service.js";
const roleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
class AccessService {
  /*
  1. check email exists
  2. hash password
  3. create accessToken, refreshTokensUsed and save
  4. generate tokens
  5. return data
  */
  static login = async ({ email, password, refreshTokensUsed = null }) => {
    // 1. check email exists
    const holeShop = await findByEmail({email});
    if (!holeShop) {
      throw new badRequestError("Error: Shop not exists !!!");
    }
    //2.
    const match = await bcypt.compare(password, holeShop.password);
    if (!match) {
      throw new authFailureError("Error: Authentication failure !!!");
    }
    //3.
    const keyAccess = crypto.randomBytes(64).toString("hex");
    const keyRefresh = crypto.randomBytes(64).toString("hex");
    //4.
    const tokens = await createTokenPair(
      {
        user: holeShop._id,
        email: holeShop.email,
        roles: holeShop.roles,
      },
      keyAccess,
      keyRefresh,
    );
    await keyTokenService.createKeyToken({
      user: holeShop._id,
      keyAccess,
      keyRefresh,
      refreshToken: tokens.refreshToken,
    });

    return {
      metadata: {
        shop: getInforData({
          fields: ["_id", "name", "email", "roles"],
          object: holeShop,
        }),
        tokens,
      },
    };
  };
  static signUp = async ({ name, email, password }) => {
    // check if user already exists
    const holeShop = await findByEmail(email);
    if (holeShop) {
      throw new badRequestError("Error: Shop already registered!!!");
    }
    const passwordHash = await bcypt.hash(password, 10);
    const newShop = await ShopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [roleShop.SHOP],
    });
    // create public and private key pair
    if (newShop) {
      const keyAccess = crypto.randomBytes(64).toString("hex");
      const keyRefresh = crypto.randomBytes(64).toString("hex");
      // create token pair
      const tokens = await createTokenPair(
        { 
          user: newShop._id,
          email,
          roles: newShop.roles,
        },
        keyAccess,
        keyRefresh,
      );
      console.log("Created Tokens: ", tokens);
      // save public key to db
      const keyStore = await keyTokenService.createKeyToken({
        user: newShop._id,
        keyAccess,
        keyRefresh,
        refreshToken: tokens.refreshToken,
      });
      if (!keyStore) {
        throw new badRequestError("Error: Creating key token!!!");
      }

      return {
        status: "error",
        code: "201",
        metadata: {
          shop: getInforData({
            fields: ["_id", "name", "email", "roles"],
            object: newShop,
          }),
          tokens,
        },
      };
    } else {
      return {
        code: "200",
        metadata: null,
      };
    }
  };
}
export { AccessService };
