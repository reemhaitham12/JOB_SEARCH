import {Router} from "express";
import {authentication} from "../../middleware/auth.middleware.js"
import * as UserService from "./service/user.service.js";
import * as validator from "./user.validation.js"
import { validation } from "../../middleware/validation.middleware.js";
import { uploadDiskFile } from "../../utils/multer/local..multer.js";
const router = new Router();
router.get("/profile",authentication(),UserService.profile)
router.get("/profile/:profileId",validation(validator.shareProfile),authentication(),UserService.shareProfile);
router.patch("/profile",validation(validator.updateBasicProfile),authentication(),UserService.updateBasicProfile);
router.patch("/profile/password",validation(validator.updatePassword),authentication(),UserService.updatePassword);
router.put('/profile-pic', authentication(), uploadDiskFile().single('image'), UserService.uploadProfilePic);
router.put('/cover-pic', authentication(), uploadDiskFile().single('image'), UserService.uploadCoverPic);
router.delete('/profile-pic', authentication(), UserService.deleteProfilePic);
router.delete('/cover-pic', authentication(), UserService.deleteCoverPic);
router.delete('/delete-account', authentication(), UserService.softDeleteAccount);
export default router;
