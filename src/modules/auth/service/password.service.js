import userModel from "../../../DB/model/user.model.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { comparedHash,generateHash  } from "../../../utils/security/hash.security.js";

import { passwordEvent } from "../../../utils/events/password.event.js";

export const sendForgetPasswordOTP = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
        return next(new Error("Email not found", { cause: 404 }));
    }
    passwordEvent.emit("sendForgetPassword", { email });

    return res.status(200).json({ message: "OTP sent successfully", email });
});

export const resetPassword = asyncHandler(async (req, res, next) => {
    const { email, code, newPassword } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
        return next(new Error("Email not found", { cause: 404 }));
    }

    const storedOTP = user.OTP.find(otp => otp.type === "ForgetPassword");

    if (!storedOTP) {
        return next(new Error("No OTP Found", { cause: 400 }));
    }


    if (new Date() > storedOTP.expireIn) {
        return next(new Error("OTP has expired", { cause: 400 }));
    }

    
    const isValidOTP = comparedHash({ plainText: `${code}`, hashValue: storedOTP.code });

    if (!isValidOTP) {
        return next(new Error("Invalid OTP", { cause: 400 }));
    }


    const hashedPassword = generateHash({ plainText: newPassword });
    await userModel.updateOne(
        { email },
        { 
            $set: { password: hashedPassword },
            $pull: { OTP: { code: storedOTP.code } } 
        }
    );

    return res.status(200).json({ message: "Password reset successfully" });
});