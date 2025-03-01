import companyModel from "../../../DB/model/company.model.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import * as dbService from "../../../DB/db.service.js";

export const addCompany = asyncHandler(async (req, res, next) => {
  const {
    companyName,
    companyEmail,
    description,
    industry,
    address,
    numberOfEmployees,
  } = req.body;

  
  const existingCompany = await dbService.findOne({
    model: companyModel,
    filter: { $or: [{ companyName }, { companyEmail }] },
  });

  if (existingCompany) {
    return next(
      new Error("Company name or email already exists", { cause: 400 })
    );
  }

  
  const company = await dbService.create({
    model: companyModel,
    data: {
      companyName,
      companyEmail,
      description,
      industry,
      address,
      numberOfEmployees,
      createdBy: req.user._id,
    },
  });

  return successResponse(res, { data: { company } });
});

export const updateCompany = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;

  
  const company = await dbService.findOne({
    model: companyModel,
    filter: { _id: companyId, createdBy: req.user._id },
  });

  if (!company) {
    return next(new Error("Company not found or unauthorized", { cause: 403 }));
  }

  
  const updateData = { ...req.body };
  delete updateData.legalAttachment;

  const updatedCompany = await dbService.updateOne({
    model: companyModel,
    filter: { _id: companyId },
    data: updateData,
  });

  return successResponse(res, { data: { updatedCompany } });
});

export const deleteCompany = asyncHandler(async (req, res, next) => {
  const { companyId } = req.params;

  
  const company = await dbService.findOne({
    model: companyModel,
    filter: { _id: companyId },
  });

  if (!company) {
    return next(new Error("Company not found", { cause: 404 }));
  }

  
  if (
    company.createdBy.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(new Error("Unauthorized", { cause: 403 }));
  }

  await dbService.updateOne({
    model: companyModel,
    filter: { _id: companyId },
    data: { deletedAt: Date.now() },
  });

  return successResponse(res, { data: "Company deleted successfully" });
});

export const getCompanyWithJobs = asyncHandler(async (req, res, next) => {
    const { companyId } = req.params;
  
    const company = await dbService.findOne({
      model: companyModel,
      filter: { _id: companyId },
      populate: [{ path: "jobs" }],
    });
  
    if (!company) {
      return next(new Error("Company not found", { cause: 404 }));
    }
  
    return successResponse(res, { data: { company } });
  });

  export const searchCompanyByName = asyncHandler(async (req, res, next) => {
    const { name } = req.query;
  
    const companies = await dbService.find({
      model: companyModel,
      filter: { companyName: { $regex: name, $options: "i" } },
    });
  
    return successResponse(res, { data: { companies } });
  });

  
  export const uploadCompanyLogo = asyncHandler(async (req, res, next) => {
    if (!req.file) {
      return next(new Error("No file uploaded", { cause: 400 }));
    }
  
    const { companyId } = req.params;
    const company = await dbService.findOne({ model: companyModel, filter: { _id: companyId } });
  
    if (!company) {
      return next(new Error("Company not found", { cause: 404 }));
    }
  
    const result = await uploadImageToCloudinary(req.file.path);
  
    await dbService.updateOne({
      model: companyModel,
      filter: { _id: companyId },
      data: { logo: { secure_url: result.secure_url, public_id: result.public_id } },
    });
  
    return successResponse(res, { data: "Logo uploaded successfully" });
  });
  
  export const deleteCompanyLogo = asyncHandler(async (req, res, next) => {
    const { companyId } = req.params;
  
    const company = await dbService.findOne({ model: companyModel, filter: { _id: companyId } });
    if (!company || !company.logo.public_id) {
      return next(new Error("Company logo not found", { cause: 404 }));
    }
  
    await deleteFromCloudinary(company.logo.public_id);
  
    await dbService.updateOne({
      model: companyModel,
      filter: { _id: companyId },
      data: { logo: {} },
    });
  
    return successResponse(res, { message: "Logo deleted successfully" });
  });
  
  export const uploadCompanyCoverPic = asyncHandler(async (req, res, next) => {
    if (!req.file) {
      return next(new Error("No file uploaded", { cause: 400 }));
    }
  
    const { companyId } = req.params;
  
    
    const company = await dbService.findOne({ model: companyModel, filter: { _id: companyId } });
  
    if (!company) {
      return next(new Error("Company not found", { cause: 404 }));
    }
  
    
    const result = await uploadImageToCloudinary(req.file.path);
  
    
    await dbService.updateOne({
      model: companyModel,
      filter: { _id: companyId },
      data: { coverPic: { secure_url: result.secure_url, public_id: result.public_id } },
    });
  
    return successResponse(res, { data: "Cover picture uploaded successfully" });
  });

  export const deleteCompanyCoverPic = asyncHandler(async (req, res, next) => {
    const { companyId } = req.params;
  
    
    const company = await dbService.findOne({ model: companyModel, filter: { _id: companyId } });
  
    if (!company || !company.coverPic.public_id) {
      return next(new Error("Cover picture not found", { cause: 404 }));
    }
  
    
    await deleteFromCloudinary(company.coverPic.public_id);
  
    
    await dbService.updateOne({
      model: companyModel,
      filter: { _id: companyId },
      data: { coverPic: {} },
    });
  
    return successResponse(res, { message: "Cover picture deleted successfully" });
  });