 

import { Router } from "express";
import { register } from "../controllers/posts.controller.js";

const router = Router();

router.route("/register").get(register)

export default router;





