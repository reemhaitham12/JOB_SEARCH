import jwt from "jsonwebtoken";
import userModel from "../../DB/model/user.model.js";
import * as dbService from "../../DB/db.service.js"
import { config } from "dotenv";
config({ path: "src/config/.env.dev" });

console.log("USER_ACCESS_TOKEN:", process.env.USER_ACCESS_TOKEN);
console.log("USER_ACCESS_TOKEN:", process.env.USER_ACCESS_TOKEN || "Not Loaded");
console.log("SYSTEM_ACCESS_TOKEN:", process.env.SYSTEM_ACCESS_TOKEN || "Not Loaded");

export const tokenTypes={
    access:"access",
    refresh:"refresh"
}

export const decodedToken = async ({
  authorization = "",
  tokenType = "access",
} = {}) => {
 
    // const { authorization } = req.headers;
    // Correct the split operation
    const [bearer, token] = authorization?.split(" ") || [];

    if (!bearer || !token) {
      return next(new Error("Invalid authorization format", { cause: 400 }));
    }
    let accessSignature = "";
    let refreshSignature = "";
    switch (bearer) {
      case "system":
        accessSignature = process.env.SYSTEM_ACCESS_TOKEN;
        refreshSignature = process.env.SYSTEM_REFRESH_TOKEN;
        break;
      case "Bearer":
        accessSignature = process.env.USER_ACCESS_TOKEN;
        refreshSignature = process.env.USER_REFRESH_TOKEN;
        break;
      default:
        break;
    }

    const decoded = verifyToken({
      token,
      signature: tokenType === tokenTypes.access ? accessSignature : refreshSignature,
    });

    if (!decoded?.id) {
      return next(new Error("Invalid token payload", { cause: 401 }));
    }

    const user = await dbService.findOne({model:userModel,filter:{ _id: decoded.id, deletedAt: null }});
    if (!user) {
      return next(new Error("User not found", { cause: 404 }));
    }
    if (user.changeCredentialTime?.getTime() >= decoded.iat * 1000) {
      return next(new Error("Invalid credentials, please log in again.", { cause: 400 }));
    }
    return user

};
export const generateToken = ({
  payload,
  signature = process.env.USER_ACCESS_TOKEN,
  expireIn = 1800,
}) => {
  const token = jwt.sign(payload, signature, { expiresIn: expireIn });
  return token;
};

console.log("USER_ACCESS_TOKEN:", process.env.USER_ACCESS_TOKEN);
export const verifyToken = ({
  token = "",
  signature = process.env.USER_ACCESS_TOKEN}={}) =>