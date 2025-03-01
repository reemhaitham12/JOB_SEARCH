import joi from 'joi';
import { generalFields } from "../../middleware/validation.middleware.js";

// signup
export const signup=joi.object().keys({
    firstName:joi.string().min(2).max(50).trim().required(),
    lastName:joi.string().min(2).max(50).trim().required(),
    email:joi.string().email({tlds:{allow:['com','net']},minDomainSegments:2,maxDomainSegments:3}).required(),
    password:joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-zA-Z])/)).required(),
    mobileNumber:joi.string().pattern(new RegExp(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/)).required()
}).required();

// confirm OTP
export const confirmEmail=joi.object().keys({
    code:joi.string().length(4).pattern(new RegExp(/^\d{4}$/)).required(),
    email:generalFields.email.required()
}).required();

// forget password
export const sendForgetPassword=joi.object().keys({
    email:generalFields.email.required(),
}).required();


// Sign In (login)
export const login =joi.object().keys({
    email:generalFields.email.required(),
    password:generalFields.password.required()
}).required();