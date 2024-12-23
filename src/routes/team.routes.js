import { Router } from "express";
import { authJwt } from "../middlewares/index.js";
import * as teamCtrl from "../controllers/team.controller.js";

const router = new Router()

router.post('/', [authJwt.verifyToken, authJwt.isAdminOrSuperAdmin], teamCtrl.createMemberTeam)
router.get('/', teamCtrl.getTeam)
router.get('/:memberTeamId', teamCtrl.getMemberTeamById)
router.put('/:memberTeamId', [authJwt.verifyToken, authJwt.isAdminOrSuperAdmin], teamCtrl.updateMemberTeamById)
router.post('/:memberTeamId', [authJwt.verifyToken, authJwt.isAdminOrSuperAdmin], teamCtrl.deleteMemberTeamById)

export default router;