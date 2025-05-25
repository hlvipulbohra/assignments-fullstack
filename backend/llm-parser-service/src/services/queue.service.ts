import { createChannel } from "../config/rabbit.mq.js";

export const sendToQueue = async (queueName: string, message: unknown) => {
  const channel = await createChannel(false,null);

  await channel.assertQueue(queueName, { durable: true });
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });

  console.log(`[Queue] Sent message to ${queueName}`);
};
