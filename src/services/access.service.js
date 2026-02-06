import ShopModel from "../models/shop.model.js";
import * as crypto from "crypto";
import bcypt from "bcrypt";
import { createTokenPair } from "../auth/authUtils.js";
import keyTokenService from "./keyToken.service.js";
import { getInforData } from "../utils/index.js";
const roleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};
class AccessService {
  signUp = async ({ name, email, password }) => {
    try {
      // check if user already exists
      const holeShop = await ShopModel.findOne({ email }).lean();
      if (holeShop) {
        return {
          code: "409",
          message: "User already exists",
          status: "error",
        };
      }
      const passwordHash = await bcypt.hash(password, 10);
      const newShop = await ShopModel.create({
        name,
        email,
        password: passwordHash,
        role: [roleShop.SHOP],
      });
      // create public and private key pair
      if (newShop) {
        const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "spki",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
          },
        });
        console.log({ privateKey, publicKey });
        // save public key to db
        const publicKeyString = await keyTokenService.createKeyToken({
          user: newShop._id,
          publicKey,
        });
        if (!publicKeyString) {
          return {
            code: "xxx",
            message: "Error creating key token",
          };
        }
        // create token pair
        const tokens = await createTokenPair(
          {
            userId: newShop._id,
            email,
            roles: newShop.role,
          },
          publicKeyString,
          privateKey,
        );
        console.log("Created Tokens: ", tokens);
        return {
          code: "201",
          metadata: {
            shop: getInforData({
              fields: ["_id", "name", "email", "role"],
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
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
      };
    }
  };
}
export const accessService = new AccessService();
