import mongoose from "mongoose";
export const connectDB = async () => {
  await mongoose
    .connect(process.env.DB_URI)
    .then((res) => {
      console.log("DB connected");
    })
    .catch((err) => {
      console.error("Fail to connect on DB", err);
    });
};
