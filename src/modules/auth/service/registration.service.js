import { asyncHandler } from "../../../utils/response/error.response.js";
import { emailEvent } from "../../../utils/events/email.event.js";
import userModel from "../../../DB/model/user.model.js";
import { successResponse } from "../../../utils/response/success.response.js";
import {generateHash,comparedHash} from "../../../utils/security/hash.security.js";
import * as dbService from "../../../DB/db.service.js"
// check user email if it exist before or not 
export const signup = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, mobileNumber } = req.body;
  // console.log({firstName,lastName , email, password,mobileNumber });
  const existUser = await userModel.findOne({ email });
  if (existUser) {
    return next(new Error("Email already Exist", { cause: 409 }));
  }
  // email
  emailEvent.emit("sendConfirmEmail", { email });
  // hash (bcrypt) password and encrypt mobileNumber (using mongoose hooks (pre save))
  // password
  const hashPassword = generateHash({ plainText: password });
  //mobileNumber
  const hashMobileNumber = generateHash({ plainText: mobileNumber });
  // build new user
  const newUser = await userModel.create({
    firstName,
    lastName,
    email,
    password: hashPassword,
    mobileNumber: hashMobileNumber,
  });
  await newUser.save();
  return successResponse(res, "User created successfully", { newUser }, 201);
});

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { email, code } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new Error("Email does not exist", { cause: 404 }));
  }

  if (user.confirmEmail) {
    return next(new Error("Email already confirmed", { cause: 409 }));
  }

  if (!user.OTP || user.OTP.length === 0) {
    return next(new Error("No OTP found. Request a new code.", { cause: 400 }));
  }

  // check OTP type ⇒ if type == “confirmEmail” confirm it if otp value is matched in the next step
  const storedOTP = user.OTP.find((otp) => otp.type === "ConfirmEmail");
  if (!storedOTP) {
    return next(
      new Error("No valid confirm code found. Request a new code.", {
        cause: 400,
      })
    );
  }
// check OTP expire date
  if (new Date() > storedOTP.expireIn) {
    return next(new Error("OTP expired. Request a new code.", { cause: 400 }));
  }
  // check otp value
  const isMatch = comparedHash({plainText: `${code}`, hashValue: `${storedOTP.code}`,
  });
  if (!isMatch) {
    return next(new Error("Invalid code", { cause: 400 }));
  }
  await userModel.updateOne(
    { email },
    { 
      $set: { confirmEmail: true },
      $unset: { OTP: "" } 
    }
  );

  return successResponse(res, "Email confirmed successfully", 200);
});
