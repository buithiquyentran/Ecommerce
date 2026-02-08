import { findById } from "../services/apiKey.service.js";
const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
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
        return res
          .status(403)
          .json({
            message:
              "Forbidden: You don't have permission to access this resource",
          });
      }
      return next();

    } catch (error) {
      return res
        .status(403)
        .json({
          message:
            "Forbidden: You don't have permission to access this resource",
        });

    }
  };
};
const asyncHandler = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}

export { apiKey, permission, asyncHandler };
