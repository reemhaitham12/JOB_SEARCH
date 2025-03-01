import {connectDB} from "./DB/connection.js";
import {globalErrorHandling} from "./utils/response/error.response.js";
import authController from "./modules/auth/auth.controller.js";
import userController from "./modules/user/user.controller.js"; 
import { decodedToken } from "./utils/security/token.security.js";
import companyController from "./modules/company/company.controller.js"
import jobController from "./modules/job/job.controller.js"
import { generateApplicationsExcel } from './modules/excel/excel.controller.js';

const bootstrap=(app,express)=>{
app.use(express.json());
connectDB();
app.get("/", (req, res,next) => {
  res.send("Hello World!");
});
app.get('/generate-applications-excel', generateApplicationsExcel);
// app.use
app.get('/your-protected-route', decodedToken, (req, res) => {
  res.send(`Hello, ${req.user.name}`); // Access user from req.user
});
app.use("/auth",authController);
app.use("/user",userController);
app.use("/company",companyController);
app.use("/job",jobController);
app.all("*", (req, res,next) => {
    res.status(404).send("Resource routing not found");
});

app.use(globalErrorHandling);
}
export default bootstrap;