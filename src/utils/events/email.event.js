import { EventEmitter } from "node:events";
import { customAlphabet } from "nanoid";
import { verificationEmailTemplate } from "../email/template/verification.email.js";
import { sendEmail } from "../email/send.email.js";
import { generateHash } from "../security/hash.security.js";
import userModel from "../../DB/model/user.model.js";
export const emailEvent = new EventEmitter({});
emailEvent.on("sendConfirmEmail", async (data) => {
  try {
    const { email } = data;
    const otp = customAlphabet("0123456789", 4)();
    const html = verificationEmailTemplate({ code: otp });
    const hashedOtp = generateHash({ plainText: otp });
    // send OTP (don’t forget to hash it) ⇒ ⚠(verify email in 10 min)
    const expireTime = new Date(Date.now() + 10 * 60 * 1000);
    await userModel.updateOne(
      { email },
      {
        $push: {
          OTP: {
            code: hashedOtp,
            type: "ConfirmEmail",
            expireIn: expireTime,
          },
        },
      }
    );
    await sendEmail({
      to: email,
      subject: "Confirm Email",
      html,
    });
  } catch (error) {
    console.error("Error sending email:", error);
  }
});
