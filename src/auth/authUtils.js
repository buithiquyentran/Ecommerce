import JWT from "jsonwebtoken";
const createTokenPair = async (payload, keyAccess, keyRefresh) => {
  try {
    // create access token
    const accessToken = await JWT.sign(payload, keyAccess, {
      expiresIn: "2 days",
    });
    const refreshToken = await JWT.sign(payload, keyRefresh, {
      expiresIn: "7 days",
    });
    JWT.verify(accessToken, keyAccess, (err, decode) => {
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
const verifyToken = async (token, keySecret) => {
  return JWT.verify(token, keySecret);
};
export { createTokenPair, verifyToken };
