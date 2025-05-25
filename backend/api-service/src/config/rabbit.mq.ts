import amqplib, { ChannelModel, Channel } from "amqplib";

let connection: ChannelModel | null = null;
let defaultChannel: Channel | null = null;

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";

// Create or reuse a RabbitMQ connection
export const connectRabbitMQ = async (onConnect:any): Promise<ChannelModel> => {
  if (connection) return connection;
  try {
    connection = await amqplib.connect(RABBITMQ_URL);

    connection.on("error", (err) => {
      console.error("[RabbitMQ] Connection error:", err);
      connection = null;
      defaultChannel = null;
    });

    connection.on("close", async () => {
      console.warn("[RabbitMQ] Connection closed. Retrying...");
      connection = null;
      defaultChannel = null;
      await new Promise((res) =>
        setTimeout(() => {
          connectRabbitMQ(onConnect).catch(() => {});
          res;
        }, 5000)
      ); // wait 5 seconds
    });

    console.log("[RabbitMQ] Connected to RabbitMQ");

    if (onConnect) await onConnect();

    return connection;
  } catch (err) {
    console.error("[RabbitMQ] Connection failed:", err);
    await new Promise((res) =>
      setTimeout(() => {
        connectRabbitMQ(onConnect).catch(() => {});
        res;
      }, 5000)
    ); // wait 5 seconds
    throw err;
  }
};

// Create a channel - shared (default) or new (if newChannel = true)
export const createChannel = async (newChannel = false, onConnect:any): Promise<Channel> => {
  if (!newChannel && defaultChannel) return defaultChannel;

  if (!connection) await connectRabbitMQ(onConnect);

  const channel = await connection!.createChannel();

  if (!newChannel) {
    defaultChannel = channel;
  }

  return channel;
};
