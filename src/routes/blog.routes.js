import { Router } from "express";
import * as blogCtrl from "../controllers/blog.controller.js";
import { authJwt } from "../middlewares/index.js";

const router = Router();

router.post("/", [authJwt.verifyToken ,authJwt.isAdminOrSuperAdmin], blogCtrl.createBlog);
router.get("/", blogCtrl.getBlogs);
router.get("/:blogId", blogCtrl.getBlogById);
router.put("/:blogId", [authJwt.verifyToken ,authJwt.isAdminOrSuperAdmin], blogCtrl.updateBlogById);
router.delete("/:blogId", [authJwt.verifyToken ,authJwt.isAdminOrSuperAdmin], blogCtrl.deleteBlogById);

export default router;