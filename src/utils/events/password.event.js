import { EventEmitter } from "node:events";
import { customAlphabet } from "nanoid";
import { sendEmail } from "../email/send.email.js";
import { generateHash } from "../security/hash.security.js";
import userModel from "../../DB/model/user.model.js";
import { resetPasswordEmailTemplate } from "../email/template/resert.password.js";

export const passwordEvent = new EventEmitter();

passwordEvent.on("sendForgetPassword", async (data) => {
  try {
    const { email } = data; 

    if (!email) {
      throw new Error("Email is required");
    }

    
    const otp = customAlphabet("0123456789", 4)();

    
    const html = resetPasswordEmailTemplate({ code: otp });

    
    const hashedOtp = generateHash({ plainText: otp });

    
    const expireTime = new Date(Date.now() + 10 * 60 * 1000);

    
    await userModel.updateOne(
      { email },
      {
        $push: {
          OTP: {
            code: hashedOtp,
            type: "ForgetPassword", 
            expireIn: expireTime,
          },
        },
      }
    );

    
    await sendEmail({
      to: email,
      subject: "Reset Password",
      html,
    });

    console.log(`✅ OTP sent successfully to ${email}: ${otp}`);
  } catch (error) {
    console.error("❌ Error sending OTP:", error);
  }
});
