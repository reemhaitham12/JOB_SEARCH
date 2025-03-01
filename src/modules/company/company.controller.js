import express from "express";
import * as companyService from "./service/company.service.js";
import { uploadDiskFile } from "../../utils/multer/local..multer.js";
import * as validator from "./company.validation.js";
import { authentication } from "../../middleware/auth.middleware.js";
import { validation } from "../../middleware/validation.middleware.js"; 


const router = express.Router();
router.post("/",validation(validator.addCompany),authentication(),companyService.addCompany)



router.patch(
  "/:companyId",
  authentication(),
  validation(validator.updateCompany),
  companyService.updateCompany
);

router.delete(
  "/:companyId",
  authentication(),
  validation(validator.companyIdValidation),
  companyService.deleteCompany
);

router.get(
  "/:companyId",
  validation(validator.companyIdValidation),
  companyService.getCompanyWithJobs
);

router.get(
  "/",
  validation(validator.searchCompany),
  companyService.searchCompanyByName
);

router.post(
  "/:companyId/logo",
  authentication(),
  validation(validator.companyIdValidation),
  uploadDiskFile().single('image'),
  companyService.uploadCompanyLogo
);


router.post(
  "/:companyId/cover",
  authentication(),
  validation(validator.companyIdValidation),
    uploadDiskFile().single('image'),
  companyService.uploadCompanyCoverPic
);

router.delete(
  "/:companyId/logo",
  authentication(),
  validation(validator.companyIdValidation),
  companyService.deleteCompanyLogo
);

router.delete(
  "/:companyId/cover",
  authentication(),
  validation(validator.companyIdValidation),
  companyService.deleteCompanyCoverPic
);

export default router;
