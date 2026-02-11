import { findById } from "../services/apiKey.service.js";
import { asyncHandler } from "../helpers/asynHandler.js";
import JWT from "jsonwebtoken";
// services
import keyTokenService from "../services/keyToken.service.js";
import { authFailureError, notFoundError } from "../core/error.response.js";

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESH_TOKEN: "x-refresh-token",
};
const apiKey = async (req, res, next) => {
  try {
    const apiKeyHeader = req.headers[HEADER.API_KEY]?.toString();
    if (!apiKeyHeader) {
      return res.status(403).json({ message: "Forbidden: Invalid API Key" });
    }
    // check db
    const objKey = await findById(apiKeyHeader);
    if (!objKey) {
      return res.status(403).json({ message: "Forbidden: Invalid API Key" });
    }
    req.objKey = objKey;
    return next();
  } catch (error) {
    throw new Error(error);
  }
};
//check permission
const permission = (permission) => {
  return (req, res, next) => {
    try {
      const objKey = req.objKey;
      if (!objKey.permissions.includes(permission)) {
        return res.status(403).json({
          message:
            "Forbidden: You don't have permission to access this resource",
        });
      }
      return next();
    } catch (error) {
      return res.status(403).json({
        message: "Forbidden: You don't have permission to access this resource",
      });
    }
  };
};
const authenticate = asyncHandler(async (req, res, next) => {
  // logic authenticate
  /*
  1. check userId in session
  2. get accessToken 
  3. verify accessToken
  4. check userId in dbs
  5. check keyStore with userId
  6. ok all -> next()
   */

  // 1.
  const userId = req.headers[HEADER.CLIENT_ID]?.toString();
  if (!userId) {
    throw new authFailureError("Invalid request");
  }
  // 2.
  const keyStore = await keyTokenService.findByUserId(userId);
  if (!keyStore) {
    throw new authFailureError("Invalid request");
  }
  //3.
  const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString();
  if (!accessToken) {
    throw new authFailureError("Invalid request");
  }
  console.log("keyStore: ", keyStore);
  try {
    const decoded = JWT.verify(accessToken, keyStore.keyAccess);
    console.log("decoded: ", decoded);
    if (userId !== decoded.user) {
      throw new authFailureError("Invalid request");
    }
    req.keyStore = keyStore;
    req.user = decoded;

    return next();
  } catch (error) {
    throw new authFailureError("Invalid request");
  }
});
const authenRefreshToken = asyncHandler(async (req, res, next) => {
  // logic authenticate
  /*
  1. check userId in session
  2. get accessToken 
  3. verify accessToken
  4. check userId in dbs
  5. check keyStore with userId
  6. ok all -> next()
   */

  // 1.
  const userId = req.headers[HEADER.CLIENT_ID]?.toString();
  if (!userId) {
    throw new authFailureError("Invalid request");
  }
  // 2.
  const keyStore = await keyTokenService.findByUserId(userId);
  console.log("keyStore v2: ", keyStore, "userId: ", userId);
  if (!keyStore) {
    throw new notFoundError("Not found keyStore V2!!!");
  }
  //3.
  const refreshToken = req.headers[HEADER.REFRESH_TOKEN]?.toString();
  if (!refreshToken) {
    throw new authFailureError("Invalid request");
  }
  console.log("keyStore: ", keyStore);
  try {
    const decoded = JWT.verify(refreshToken, keyStore.keyRefresh);
    console.log("decoded: ", decoded);
    if (userId !== decoded.user) {
      throw new authFailureError("Invalid request");
    }
    req.keyStore = keyStore;
    req.refreshToken = refreshToken;
    req.user = decoded;
    return next();
  } catch (error) {
    throw new authFailureError("Invalid request");
  }
});
export { apiKey, permission, authenticate, authenRefreshToken };
