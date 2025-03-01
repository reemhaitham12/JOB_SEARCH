import { successResponse } from '../../../utils/response/success.response.js';
import jobModel from '../../../DB/model/job.model.js'
import { asyncHandler } from "../../../utils/response/error.response.js"

export const addJob = asyncHandler(async (req, res, next) => {
  const { jobTittle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills, companyId } = req.body;

  if (!jobTittle || !jobLocation || !workingTime || !seniorityLevel || !jobDescription || !technicalSkills || !softSkills || !companyId) {
    return next(new Error("All fields are required", { cause: 400 }));
  }

  const job = await jobModel.create({
    jobTittle,
    jobLocation,
    workingTime,
    seniorityLevel,
    jobDescription,
    technicalSkills,
    softSkills,
    addedBy: req.user._id, 
    companyId,
  });

  return successResponse (res,{data:{job},message:"Job created successful"})
});

export const updateJob = asyncHandler(async (req, res, next) => {
  const { jobId } = req.params;
  const { jobTittle, jobLocation, workingTime, seniorityLevel, jobDescription, technicalSkills, softSkills } = req.body;

  const job = await jobModel.findById(jobId);

  if (!job) {
    return next(new Error("Job not found", { cause: 404 }));
  }

  // Ensure that only the company HR or owner can update the job
  if (job.companyId !== req.user.companyId) {
    return next(new Error("You are not authorized to update this job", { cause: 403 }));
  }

  job.jobTittle = jobTittle || job.jobTittle;
  job.jobLocation = jobLocation || job.jobLocation;
  job.workingTime = workingTime || job.workingTime;
  job.seniorityLevel = seniorityLevel || job.seniorityLevel;
  job.jobDescription = jobDescription || job.jobDescription;
  job.technicalSkills = technicalSkills || job.technicalSkills;
  job.softSkills = softSkills || job.softSkills;
  job.updatedBy = req.user._id;

  await job.save();

  res.status(200).json({ message: 'Job updated successfully', job });
});


