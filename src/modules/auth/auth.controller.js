import { Router } from "express";
import * as LoginService from "../auth/service/login.service.js"
import * as PasswordService from "./service/password.service.js"
import * as SignupService from "./service/registration.service.js"
import * as validators from './auth.validation.js'
import { validation } from "../../middleware/validation.middleware.js";
const router=new Router();
// signup
router.post("/signup",validation(validators.signup),SignupService.signup);
// confirm Email
router.patch("/confirmEmail",validation(validators.confirmEmail),SignupService.confirmEmail);
// send forget password OTP
router.post("/sendForgetPasswordOTP", PasswordService.sendForgetPasswordOTP);
// reset password
router.post("/resetPassword",PasswordService.resetPassword);
// login
router.post("/login",validation(validators.login),LoginService.login);
// refresh Token
router.get("/refresh-token",LoginService.RefreshToken)
export default router;