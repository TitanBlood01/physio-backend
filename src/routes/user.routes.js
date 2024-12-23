import { Router } from "express";
import * as userCtrl from "../controllers/user.controller.js";
import { authJwt } from "../middlewares/index.js";

const router = new Router()

router.post('/', [authJwt.verifyToken, authJwt.isAdminOrSuperAdmin], userCtrl.createUser);
router.get('/', [authJwt.verifyToken, authJwt.isAdminOrSuperAdmin], userCtrl.getUsers);
router.get('/:userId', [authJwt.verifyToken, authJwt.isAdminOrSuperAdmin], userCtrl.getUserById);
router.put('/:userId', [authJwt.verifyToken, authJwt.isAdminOrSuperAdmin], userCtrl.updateUserById);
router.delete('/:userId', [authJwt.verifyToken, authJwt.isSuperAdmin], userCtrl.deleteUserById);

export default router;