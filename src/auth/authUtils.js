import jwt from "jsonwebtoken";
const createTokenPair = async (payload, keyAccess, keyRefresh) => {
  try {
    // create access token
    const accessToken = await jwt.sign(payload, keyAccess, {
      expiresIn: "2 days",
    });
    const refreshToken = await jwt.sign(payload, keyRefresh, {
      expiresIn: "7 days",
    });
    jwt.verify(accessToken, keyAccess, (err, decode) => {
      if (err) {
        console.error("Error verify access token: ", err);
      } else {
        console.log("Decode access token: ", decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error(error);
  }
};
export { createTokenPair };
