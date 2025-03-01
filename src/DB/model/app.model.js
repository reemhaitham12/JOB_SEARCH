import mongoose, { Schema, model } from "mongoose";
export const appSchema= new mongoose.Schema({
    jobId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    userCV:{
        secure_url: {
            type: String,
            required: true,
            },
            public_id: {
                type: String,
                required: true,
            }
    },
    status:{
        type: String,
        enum: ["pending", "accepted", "viewed", "in consideration", "rejected"],
        default: "pending"
    }
},{ timestamps: true });
const appModel= mongoose.models.App || model("App", appSchema);
export default appModel;