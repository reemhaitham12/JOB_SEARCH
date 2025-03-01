import joi from "joi";

import { generalCompany } from "../../middleware/validation.middleware.js";

export const addCompany = joi.object().keys({
  companyName: generalCompany.companyName.required(),
  description: generalCompany.description.required(),
  industry: generalCompany.industry.required(),
  address: generalCompany.address.required(),
  numberOfEmployees:generalCompany.numberOfEmployees.required(),
  companyEmail: generalCompany.companyEmail.required(),
}).required();

export const updateCompany = joi.object().keys({
    companyName: generalCompany.companyName,
    description: generalCompany.description,
    industry: generalCompany.industry,
    address: generalCompany.address,
    numberOfEmployees:generalCompany.numberOfEmployees
}).required();

export const searchCompany = joi.object().keys({
  companyName: generalCompany.companyName
}).required();

export const companyIdValidation = joi.object().keys({
  companyId: generalCompany.companyId.required()
}).required();
