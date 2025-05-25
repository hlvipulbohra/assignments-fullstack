import { Router } from "express";
import * as ResumeController from "../controllers/resume.controller";
const router = Router();

router.post("/parse", ResumeController.handleResumeUpload);
router.get("/status/:id", ResumeController.getResumeStatus);
router.get("/:id", ResumeController.getResume);
router.get("/view/all", ResumeController.getAllResumes);

export default router;
