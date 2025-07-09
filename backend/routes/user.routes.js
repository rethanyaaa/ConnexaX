import { Router } from "express";
import {
  getAllUserProfile,
  getUserAndProfile,
  register,
  updateProfileDate,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { login } from "../controllers/user.controller.js";
import { uploadProfilePicture } from "../controllers/user.controller.js";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router
  .route("/update_profile_picture")
  .post(upload.single("profile_picture"), uploadProfilePicture);

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/user_update").post(updateUserProfile);
router.route("/get_user_and_profile").post(getUserAndProfile);
router.route("/update_profile_data").post(updateProfileDate);
router.route("/get_all_users").get(getAllUserProfile);

export default router;
