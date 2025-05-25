import dotenv from "dotenv";
dotenv.config();
import { connectRabbitMQ } from "./config/rabbit.mq.js";
import { setupConsumer } from "./consumers/resume-parser-consumer.js";
const startService = async () => {
  try {
    await connectRabbitMQ(setupConsumer)
    console.log("LLM Parser Service is running");
  } catch (err) {
    console.error("Error while starting the service:", err);
  }
};

startService();
