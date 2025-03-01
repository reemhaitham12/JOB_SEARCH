
import  mongoose,{model, Types } from "mongoose";
export const roleTypes={user:"User",admin:"Admin"};
export const genderTypes={male:"male",female:"female"};
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    provider: {
      type: String,
      enum: ["google", "system"],
      require: true,
    },
    gender: {
      type: String,
      enum: Object.values(genderTypes),
      default:"male",
    },
    DOB: {
      type: Date,
      require: true,
      validate: {
        validator: function (value) {
          const today = new Date();
          const age = today.getFullYear() - value.getFullYear();
          return age >= 18;
        },
        message: "Age must be greater than 18 years",
      },
    },
    mobileNumber: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      enum: Object.values(roleTypes),
      default: "User",
    },
    isConfirmed: {
      type: Boolean,
      default: false,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    bannedAt: {
      type: Date,
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    changeCredentialTime: {
      type: Date,
    },
    ProfilePic: 
      {
        secure_url: {
          type: String,
          default: "",
        },
        public_id: {
          type: String,
          default: "",
        },
      },
    
    CoverPic: 
      {
        secure_url: {
          type: String,
          default: "",
        },
        public_id: {
          type: String,
          default: "",
        },
      },
    
      OTP: [
        {
          code: {
            type: String,
            required: true,
            minlength: 4, 
            maxlength: 4, 
          },
          type: {
            type: String,
            enum: ["ConfirmEmail", "ForgetPassword"],
            required: true,
          },
          expireIn: {
            type: Date,
            required: true,
          },
        }
      ], 
      viewer:[
        {
          userId:{type:Types.ObjectId,
            ref:'User'
          },
          time:Date
        }
      ]     
  },
  { timestamps: true }
);


userSchema.virtual("username").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const userModel = mongoose.models.User || model("User", userSchema);
export default userModel;
