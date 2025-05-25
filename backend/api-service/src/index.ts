import dotenv from "dotenv";
dotenv.config();

import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";

import { connectToMongo } from "./config/db";
import { corsOptions } from "./config/corsOptions";
import healthRoutes from "./routes/health.routes";
import resumeRoutes from "./routes/resume.routes";
import {connectRabbitMQ} from "./config/rabbit.mq";
import { setupConsumer } from "./consumers/save-resume-consumer";
import { setupDlqConsumer } from "./consumers/dead-letter-queue-consumer";

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api/", healthRoutes);

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(rateLimit({ windowMs: 60 * 1000, max: 100 }));

app.use("/api/resume", resumeRoutes);

const setupMQConsumer = async () => {
  await setupConsumer();
  await setupDlqConsumer();
}
const startServer = async () => {
  try {
    await connectToMongo();   
    app.listen(PORT, () => {
      console.log(`API service is running on port ${PORT}`);
    });
    await connectRabbitMQ(setupMQConsumer);
  } catch (err) {
    console.error("Error while starting the server:", err);
    setTimeout(() => {
      ()=>{        
        console.error("Retrying to start the server...");
        startServer()
      };
    }, 1000);
  }
};

startServer();
