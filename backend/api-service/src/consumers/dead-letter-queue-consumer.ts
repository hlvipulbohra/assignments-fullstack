import { createChannel } from "../config/rabbit.mq";
import * as ResumeModel from "../models/resume.model";
import { redis } from "../config/redis";

const DEAD_LETTER_QUEUE = process.env.DEAD_LETTER_QUEUE || "dead_letter_queue";

const processResume = async (resume: any) => {
  try {
    // save the resume to the database
    if (!resume._id) throw new Error("Resume ID is not provided");
    const savedResume = await ResumeModel.updateResumeStatus(resume._id, {
      status: "failed",
    });
    // update status in redis
    await redis.set(
      `resume:${resume._id.toString()}`,
      savedResume?.status || "failed",
      'EX',
      60 // seconds
    );
  } catch (error) {
    console.error("Error processing resume:", error);
  }
};

export async function setupDlqConsumer() {
  try {
    const channel = await createChannel(true, setupDlqConsumer);
    await channel.assertQueue(DEAD_LETTER_QUEUE, { durable: true });

    for (let i = 0; i < 5; i++) {
      // create a new channel for each consumer
      const channel = await createChannel(true, setupDlqConsumer);

      // consume messages from the queue
      channel.consume(DEAD_LETTER_QUEUE, async (msg: any) => {
        if (msg) {
          const resume = JSON.parse(msg.content);
          await processResume(resume);
          channel.ack(msg);
        }
      });

      console.log(`Consumer listening on queue: ${DEAD_LETTER_QUEUE}`);
    }
  } catch (err) {
    console.error("Error setting up consumer:", err);
  }
}
