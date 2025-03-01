import Joi from 'joi';


export const jobValidationSchema = Joi.object({
  jobTittle: Joi.string().required().trim(),
  jobLocation: Joi.string().valid('onsite', 'remotely', 'hybrid').required(),
  workingTime: Joi.string().valid('part-time', 'full-time').required(),
  seniorityLevel: Joi.string().valid('fresh', 'Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO').required(),
  jobDescription: Joi.string().required().trim(),
  technicalSkills: Joi.array().items(Joi.string()).required(),
  softSkills: Joi.array().items(Joi.string()).required(),
  companyId: Joi.string().required(),
});


export const updateJobValidationSchema = Joi.object({
  jobTittle: Joi.string().optional().trim(),
  jobLocation: Joi.string().valid('onsite', 'remotely', 'hybrid').optional(),
  workingTime: Joi.string().valid('part-time', 'full-time').optional(),
  seniorityLevel: Joi.string().valid('fresh', 'Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO').optional(),
  jobDescription: Joi.string().optional().trim(),
  technicalSkills: Joi.array().items(Joi.string()).optional(),
  softSkills: Joi.array().items(Joi.string()).optional(),
});
