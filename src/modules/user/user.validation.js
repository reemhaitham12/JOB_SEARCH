import joi from 'joi'
import {generalFields} from '../../middleware/validation.middleware.js'
export const shareProfile=joi.object().keys({
    profileId:generalFields.id.required()
}).required()

export const updateBasicProfile=joi.object().keys({
    mobileNumber:generalFields.mobileNumber,
    DOB:generalFields.DOB,
    firstName:generalFields.firstName,
    lastName:generalFields.lastName,
    gender:generalFields.gender
}).required()

export const updatePassword=joi.object().keys({
    oldPassword: generalFields.password.required(),
    password: generalFields.password.disallow(joi.ref("oldPassword")).required(),
    confirmationPassword: joi.string().valid(joi.ref("password")).required()
})