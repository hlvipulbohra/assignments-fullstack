import { createChannel } from "../config/rabbit.mq";
import * as ResumeModel from "../models/resume.model";
import { sendToQueue } from "../services/queue.service";
import { redis } from "../config/redis";

const DEAD_LETTER_QUEUE = process.env.DEAD_LETTER_QUEUE || "dead_letter_queue";
const SAVE_RESUME_QUEUE = process.env.SAVE_RESUME_QUEUE || "save_resume_queue";

const processResume = async (resume: any) => {
  try {
    // save the resume to the database
    if (!resume._id) throw new Error("Resume ID is required");
    resume.status = resume.status || 'completed';
    const savedResume = await ResumeModel.updateResumeStatus(
      resume._id,
      resume
    );
    // update status in redis
    
    await redis.set(
        `resume:${resume._id.toString()}`,
         savedResume?.status || "completed",
          'EX',
        60 // seconds
    );

  } catch (error) {
    console.error("Error processing resume:", error);
    // Send to dead letter queue
    await sendToQueue(DEAD_LETTER_QUEUE, resume);
  }
};

export async function setupConsumer() {
  try {
    const channel = await createChannel(true, setupConsumer);
    await channel.assertQueue(SAVE_RESUME_QUEUE, { durable: true });

    for (let i = 0; i < 5; i++) {
      // create a new channel for each consumer
      // This is to ensure that each consumer can process messages independently
      const channel = await createChannel(true, setupConsumer);

      // consume messages from the queue
      channel.consume(SAVE_RESUME_QUEUE, async (msg: any) => {
        if (msg) {
          const resume = JSON.parse(msg.content);
          await processResume(resume);
          channel.ack(msg);
        }
      });

      console.log(`Consumer listening on queue: ${SAVE_RESUME_QUEUE}`);
    }
  } catch (err) {
    console.error("Error setting up consumer:", err);
  }
}
