import { Request, Response } from "express";
import { redis } from "../config/redis";
import { sendToQueue } from "../services/queue.service";
import * as ResumeModel from "../models/resume.model";

const RESUME_EXTRACTION_QUEUE =
  process.env.RESUME_EXTRACTION_QUEUE || "resume_extraction_queue";

export const handleResumeUpload = async (req: Request, res: Response) => {
  try {
    const { content, email } = req.body;

    // Save to MongoDB
    const savedResume = await ResumeModel.saveResumeToDb(content, email);

    // Send to RabbitMQ queue
    await sendToQueue(RESUME_EXTRACTION_QUEUE, savedResume);

    try {
       // Add to Redis with status
    if (savedResume._id)
      await redis.set(
        `resume:${savedResume._id.toString()}`,
         savedResume.status,
         'EX',
          60 // seconds
      );
    } catch (error) {
      console.warn("Redis not available, skipping Redis update:", error);
    }
    // Respond to client
    res.status(201).json({
      message: "Resume saved and processing started.",
      savedResume,
    });
  } catch (err) {
    console.error("Error handling resume upload:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getResumeStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "ID is required" });
      return;
    }

    let redisStatus: string | null = null;
    // Search in Redis
    try {
      redisStatus = await redis.get(`resume:${id}`);
    } catch (e) {
      console.warn("Redis not available, falling back to DB:", e);
    }

    if (redisStatus) {
      res.status(200).json({ status: redisStatus });
      return;
    }

    // Check MongoDB
    const dbStatus = await ResumeModel.findStatus(id);
    if (!dbStatus) {
      res.status(404).json({ message: "Resume not found" });
      return;
    }
    try {
      // set Redis with the status
    await redis.set(
      `resume:${id}`, dbStatus,
        'EX',
         60 // seconds
     );
    } catch (error) {
      console.warn("Redis not available, skipping Redis update:", error);
    }
    
    res.status(200).json({ status: dbStatus });
    
  } catch (err) {
    console.error("Error getting resume status:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getResume = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "ID is required" });
      return;
    }

    const resume = await ResumeModel.getResume(id);
    res.status(200).json({ resume });
    
  } catch (err) {
    console.error("Error getting resume status:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllResumes = async (req: Request, res: Response) => {
  try {
    const { email } = req.query;
    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    const resumes = await ResumeModel.getAllResumes(email as string);
    res.status(200).json(resumes);
  } catch (err) {
    console.error("Error getting all resumes:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
