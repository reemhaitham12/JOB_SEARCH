import joi from "joi";
import { Types } from "mongoose";
import { genderTypes } from "../DB/model/user.model.js";

const checkObjectId = (value, helper) => {
    return Types.ObjectId.isValid(value) ? value : helper.message("Invalid ObjectId");
};


export const generalFields = {
    firstName:joi.string().min(2).max(50).trim().required(),
        lastName:joi.string().min(2).max(50).trim().required(),
        email:joi.string().email({tlds:{allow:['com','net']},minDomainSegments:2,maxDomainSegments:3}).required(),
        password:joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-zA-Z])/)).required(),
        mobileNumber:joi.string().pattern(new RegExp(/^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/)).required(),
        id: joi.string().custom(checkObjectId, "ObjectId Validation"),
        gender:joi.string().valid("male", "female", "other").required(),
        DOB:joi.date().less("now"),
        isConfirmed: joi.any()
};

export const validation=(schema)=>{
    return (req,res,next)=>{
        const inputData={...req.body,...req.params,...req.query};
        const validationResult=schema.validate(inputData,{abortEarly:false});
        if(validationResult.error){
            return res.status(400).json({message:"validation error",
                details:validationResult.error.details
            })
        }
        return next();
    }
}