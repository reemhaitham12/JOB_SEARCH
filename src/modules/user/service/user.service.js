import userModel from "../../../DB/model/user.model.js";
import { asyncHandler } from "../../../utils/response/error.response.js";
import { successResponse } from "../../../utils/response/success.response.js";
import { comparedHash, generateHash } from "../../../utils/security/hash.security.js";
import * as dbService from "../../../DB/db.service.js"


export const profile= asyncHandler(async(req,res,next)=>{
  // const user=await dbService.findOne({
  //   model:userModel,
  //   filter:{_id:req.user._id},
  //   populate: [{ path: "viewers.userId" }]
  // })
  return successResponse(res,{data:{user:req.user}})
})

export const shareProfile = asyncHandler(async (req, res, next) => {
  console.log("Authenticated User:", req.user); // 🔍 التحقق من بيانات المستخدم

  const { profileId } = req.params;

  const user = await dbService.findOne({
    _id: profileId,
    model: userModel,
    deletedAt: null,
    select: "userName mobileNumber profilePic coverPic"
  });

  if (!user) {
    return next(new Error("User not found", { cause: 404 }));
  }

  if (!req.user) {
    return next(new Error("Authentication error: User not found in request", { cause: 401 }));
  }

  if (profileId !== req.user._id.toString()) {
    await dbService.updateOne({
      model: userModel,
      filter: { _id: profileId },
      data: {
        $push: {
          viewers: {
            userId: req.user._id,
            time: Date.now()
          }
        }
      }
    });
  }

  return successResponse(res, { data: { user } });
});


export const updateBasicProfile=asyncHandler(async(req,res,next)=>{
  let updateData = { ...req.body };
  if (req.body.mobileNumber) {
    updateData.mobileNumber = generateHash({ plainText: req.body.mobileNumber });
  }
  const user= await dbService.updateOne({
    model:userModel,
    filter:{_id:req.user._id},
    data:req.body
  })
  return successResponse(res, { data: { user } });
})

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
