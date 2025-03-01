import mongoose, { Schema, model } from "mongoose";
const jobSchema= new mongoose.Schema({
    jobTittle:{
        type:String,
        required:true,
        trim:true
    },
    jobLocation:{
        type: String,
        enum: ['onsite', 'remotely', 'hybrid'],
        required: true
    },
    workingTime:{
        type: String,
        enum: ['part-time', 'full-time'],
        required: true
    },
    seniorityLevel:{
        type: String,
        enum: ['fresh', 'Junior', 'Mid-Level', 'Senior', 'Team-Lead', 'CTO'],
        required: true
    },
    jobDescription:{
        type:String,
        required:true,
        trim:true
    },
    technicalSkills:{
        type:[String],
        required:true
    },
    softSkills:{
        type:[String],
        required:true
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HR',
        required: true
    },
    updatedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HR',
    },
    closed:{
        type:Boolean,
        default:false
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: true
    },

},{ timestamps: true });
const jobModel = mongoose.models.Job || model("Job", jobSchema);
export default jobModel;