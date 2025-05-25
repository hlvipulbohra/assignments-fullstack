import { createChannel } from "../config/rabbit.mq";
import { sendToQueue } from "../services/queue.service";
import { validateResume } from "../utils/validators";

//  Queue names
const RESUME_VALIDATION_QUEUE =
  process.env.VALIDATE_RESUME_QUEUE || "resume_validation_queue";
const SAVE_RESUME_QUEUE = process.env.SAVE_RESUME_QUEUE || "save_resume_queue";
const DEAD_LETTER_QUEUE = process.env.DEAD_LETTER_QUEUE || "dead_letter_queue";

const processResume = async (resume: any) => {
  try {
    const validatedResume = validateResume(resume);
    validatedResume._id ||= resume._id;
    // Send to RabbitMQ queue
    await sendToQueue(SAVE_RESUME_QUEUE, validatedResume);
  } catch (error) {
    console.error("Error processing resume:", error);
    // Send to dead letter queue
    await sendToQueue(DEAD_LETTER_QUEUE, resume);
  }
};

export const setupConsumer = async () => {
  try {
    const channel = await createChannel(true, setupConsumer);
    await channel.assertQueue(RESUME_VALIDATION_QUEUE, { durable: true });

    for (let i = 0; i < 5; i++) {
      // create a new channel for each consumer
      const channel = await createChannel(true, setupConsumer);

      // consume messages from the queue
      channel.consume(RESUME_VALIDATION_QUEUE, async (msg: any) => {
        if (msg) {
          const resume = JSON.parse(msg.content);
          await processResume(resume);
          channel.ack(msg);
        }
      });

      console.log(`Consumer listening on queue: ${RESUME_VALIDATION_QUEUE}`);
    }
  } catch (err) {
    console.error("Error setting up consumer:", err);
    await new Promise((res) =>
      setTimeout(() => {
        setupConsumer().catch(() => {});
        res;
      }, 5000)
    ); // wait 5 seconds
  }
};
