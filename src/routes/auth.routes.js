import { Router } from "express";
const router = Router()

import * as authCtrl from "../controllers/auth.controller.js";
import { verifySignUp } from "../middlewares/index.js";

router.post('/signup', [verifySignUp.checkDuplicateCI, verifySignUp.checkRolesExisted], authCtrl.signUp)
router.post('/signin', authCtrl.signIn)
router.post('/create-superadmin', authCtrl.createSuperAdmin)
router.post("/superadmin/signin", authCtrl.superAdminSignIn);

export default router;