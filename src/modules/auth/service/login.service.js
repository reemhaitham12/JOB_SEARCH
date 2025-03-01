import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import userModel, { roleTypes } from "../../../DB/model/user.model.js";
import { comparedHash } from "../../../utils/security/hash.security.js";
import {
  verifyToken,
  generateToken,
  decodedToken,
  tokenTypes,
} from "../../../utils/security/token.security.js";

// login
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    return next(new Error("User Not Found", { cause: 404 }));
  }

  // check the email confirm
  if (!user.isConfirmed) {
    return next(new Error("Please verify your account first", { cause: 400 }));
  }

  // compare the password with the hashed password in the database
  const isMatch = comparedHash({
    plainText: password,
    hashValue: user.password,
  });

  if (!isMatch) {
    return next(new Error("Incorrect email or password", { cause: 401 }));
  }

  // Generate access and refresh tokens
  const accessToken = generateToken({
    payload: { id: user._id },
    signature:
      user.role === roleTypes.admin
        ? process.env.SYSTEM_ACCESS_TOKEN
        : process.env.USER_ACCESS_TOKEN,
    expireIn: "1h", // Access token expires in 1 hour
  });

  const refreshToken = generateToken({
    payload: { id: user._id },
    signature:
      user.role === roleTypes.admin
        ? process.env.SYSTEM_REFRESH_TOKEN
        : process.env.USER_REFRESH_TOKEN,
    expireIn: "7d", // Refresh token expires in 7 days
  });

  return successResponse(
    res,
    "Login successful",
    {
      accessToken,
      refreshToken,
    },
    200
  );
});

// refresh token
export const RefreshToken = asyncHandler(async (req, res, next) => {
  const user= await decodedToken({authorization:req.headers.authorization,tokenType:tokenTypes.refresh})
  // Generate new access and refresh tokens
  const accessToken = generateToken({
    payload: { id: user._id },
    signature:
      user.role === roleTypes.admin
        ? process.env.SYSTEM_ACCESS_TOKEN
        : process.env.USER_ACCESS_TOKEN,
    expireIn: "1h",
  });

  const refreshToken = generateToken({
    payload: { id: user._id },
    signature:
      user.role === roleTypes.admin
        ? process.env.SYSTEM_REFRESH_TOKEN
        : process.env.USER_REFRESH_TOKEN,
    expireIn: "7d",
  });

  return successResponse(
    res,
    "Token refreshed successfully",
    {
      accessToken,
      refreshToken,
    },
    200
  );
});
