import { Router } from "express";
import * as servicesCtrl from "../controllers/services.controller.js";
import { authJwt } from "../middlewares/index.js";

const router = new Router()


router.post('/', [authJwt.verifyToken ,authJwt.isAdminOrSuperAdmin],servicesCtrl.createService)
router.get('/', servicesCtrl.getServices)
router.get('/:serviceId', servicesCtrl.getServiceById)
router.put('/:serviceId', [authJwt.verifyToken ,authJwt.isAdminOrSuperAdmin] ,servicesCtrl.updateServiceById)
router.delete('/:serviceId', [authJwt.verifyToken, authJwt.isAdminOrSuperAdmin], servicesCtrl.deleteServiceById)

export default router;

