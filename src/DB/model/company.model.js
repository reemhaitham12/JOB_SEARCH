import mongoose, { Schema, model } from "mongoose";

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    numberOfEmployees: {
      type: Number,
      required: true,
      min: 11,
      max: 20,
    },
    companyEmail: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    logo: {
      secure_url: String,
      public_id: String,
    },
    coverPic: {
      secure_url: String,
      public_id: String,
    },
    HRs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    bannedAt: {
      type: Date,
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    legalAttachment: {
      secure_url: String,
      public_id: String,
    },
    approvedByAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

companySchema.virtual("jobs", {
    ref: "Job",
    localField: "_id",
    foreignField: "companyId",
  });

const companyModel = mongoose.models.Company || model("Company", companySchema);
export default companyModel;

