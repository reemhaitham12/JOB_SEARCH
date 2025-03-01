import userModel from "../../../DB/model/user.model.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { comparedHash, generateHash } from "../../../utils/security/hash.security.js";
import * as dbService from "../../../DB/db.service.js";


export const updateBasicProfile = asyncHandler(async (req, res, next) => {
  let updateData = { ...req.body };

  if (req.body.mobileNumber) {
    updateData.mobileNumber = generateHash({ plainText: req.body.mobileNumber });
  }

  const user = await dbService.updateOne({
    model: userModel,
    filter: { _id: req.user._id },
    data: updateData,
  });

  return successResponse(res, { data: { user } });
});


export const profile = asyncHandler(async (req, res, next) => {
  const user = await dbService.findOne({
    model: userModel,
    filter: { _id: req.user._id },
    select: "firstName lastName gender DOB mobileNumber ProfilePic CoverPic",
  });

  
  const decryptedMobile = comparedHash({
    plainText: req.user.mobileNumber, 
    hashValue: user.mobileNumber,
  }) ? req.user.mobileNumber : "****"; 

  return successResponse(res, { data: { ...user.toObject(), mobileNumber: decryptedMobile } });
});


export const shareProfile = asyncHandler(async (req, res, next) => {
  const { profileId } = req.params;

  const user = await dbService.findOne({
    model: userModel,
    filter: { _id: profileId, deletedAt: null },
    select: "firstName lastName mobileNumber ProfilePic CoverPic",
  });

  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  
  const decryptedMobile = comparedHash({
    plainText: req.user.mobileNumber, 
    hashValue: user.mobileNumber,
  }) ? req.user.mobileNumber : "****";

  
  if (profileId !== req.user._id.toString()) {
    await dbService.updateOne({
      model: userModel,
      filter: { _id: profileId },
      data: { $push: { viewers: { userId: req.user._id, time: Date.now() } } },
    });
  }

  return successResponse(res, { 
    data: { 
      userName: `${user.firstName} ${user.lastName}`,
      mobileNumber: decryptedMobile,
      profilePic: user.ProfilePic,
      coverPic: user.CoverPic
    } 
  });
});
// update password
export const updatePassword=asyncHandler(async(req,res,next)=>{
  const{oldPassword,password}=req.body
  if(!comparedHash({plainText:oldPassword,hashValue:req.user.password})){
    return next(new Error("Invalid old Password",{cause:400}))
  }
  await dbService.findByAndUpdate({
    model:userModel,
    id:req.user._id,
    data:{password:generateHash({plainText:password}),options:{changeCredentialsTime:Date.now(),new: true}}
  })
  return successResponse(res, { data: { } });
})

export const uploadProfilePic = asyncHandler(async (req, res, next) => {
  if (!req.file) {
      return next(new Error("No file uploaded", { cause: 400 }));
  }

  const userId = req.user._id;

  await dbService.updateOne({
      model: userModel,
      filter: { _id: userId },
      data: { profilePic: req.file.filename }
  });

  return successResponse(res, { message: "Profile picture updated successfully", data: { profilePic: req.file.filename } });
});

export const uploadCoverPic = asyncHandler(async (req, res, next) => {
  if (!req.file) {
      return next(new Error("No file uploaded", { cause: 400 }));
  }

  const userId = req.user._id;

  await dbService.updateOne({
      model: userModel,
      filter: { _id: userId },
      data: { coverPic: req.file.filename }
  });

  return successResponse(res, { message: "Cover picture updated successfully", data: { coverPic: req.file.filename } });
});


export const deleteProfilePic = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  await dbService.updateOne({
      model: userModel,
      filter: { _id: userId },
      data: { profilePic: null }
  });

  return successResponse(res, { message: "Profile picture deleted successfully" });
});

export const deleteCoverPic = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  await dbService.updateOne({
      model: userModel,
      filter: { _id: userId },
      data: { coverPic: null }
  });

  return successResponse(res, { message: "Cover picture deleted successfully" });
});

export const softDeleteAccount = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const user = await dbService.findOne({ _id: userId, model: userModel });

  if (!user) {
      return next(new Error("User not found", { cause: 404 }));
  }

  await dbService.updateOne({
      model: userModel,
      filter: { _id: userId },
      data: { deletedAt: new Date() }
  });

  return successResponse(res, { message: "Account has been soft deleted." });
});
