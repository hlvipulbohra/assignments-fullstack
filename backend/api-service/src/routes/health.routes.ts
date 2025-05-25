import { Router, Request, Response } from "express";

const router = Router();

router
  .get("/", (req: Request, res: Response) => {
    res.send("API service is running");
  })
  .get("/health", async (req: Request, res: Response) => {
    try {
      res.status(200).json({ status: "OK", uptime: process.uptime() });
    } catch (error) {
      res.status(500).json({ status: "ERROR", message: "Server is down" });
    }
  });

export default router;
