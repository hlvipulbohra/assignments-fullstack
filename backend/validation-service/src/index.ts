import dotenv from "dotenv";
dotenv.config();
import { connectRabbitMQ } from "./config/rabbit.mq";
import { setupConsumer } from "./consumers/resume-validator-consumer";

const startService = async () => {
  try {
  await connectRabbitMQ(setupConsumer)
    console.log("Validator Service is running");
  } catch (err) {
    console.error("Error while starting the service:", err);
  }
};

startService();
