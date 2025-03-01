import {Router} from "express";
import {authentication} from "../../middleware/auth.middleware.js"
import * as UserService from "./service/user.service.js";
import * as validator from "./user.validation.js"
import { validation } from "../../middleware/validation.middleware.js";
const router = new Router();
router.get("/profile",authentication(),UserService.profile)
router.get("/profile/:profileId",validation(validator.shareProfile),authentication(),UserService.shareProfile)
router.patch("/profile",validation(validator.updateBasicProfile),authentication(),UserService.updateBasicProfile);
router.patch("/profile/password",validation(validator.updatePassword),authentication(),UserService.updatePassword);
export default router;
