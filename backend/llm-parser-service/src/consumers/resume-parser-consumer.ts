import { createChannel } from "../config/rabbit.mq.js";
import { sendToQueue } from "../services/queue.service.js";

//  Gemini utility functions imports
import { generatePrompt } from "../utils/promptGenerator.js";
import { parseAIResponse } from "../utils/aiResponseParser.js";
import resumeSchema from "../utils/resume.type.gemini.schema.js";
import { sendPromptToGemini } from "../utils/geminiClient.js";

// Queue names
const RESUME_EXTRACTION_QUEUE =
  process.env.RESUME_EXTRACTION_QUEUE || "resume_extraction_queue";
const RESUME_VALIDATION_QUEUE =
  process.env.VALIDATE_RESUME_QUEUE || "resume_validation_queue";
const DEAD_LETTER_QUEUE = process.env.DEAD_LETTER_QUEUE || "dead_letter_queue";

const processResume = async (resume: any) => {
  try {
    const generatedPrompt = generatePrompt(resume.rawContent);

    const result = await sendPromptToGemini({
      model: "gemini-2.5-flash-preview-05-20",
      prompt: generatedPrompt, // The prompt generated from the resume content
      system:
        "You are a precise JSON extraction agent. Your sole job is to return valid JSON strictly in the format provided. You must not respond with anything other than the JSON object.",
      temperature: 0, // temperature is set to 0 for deterministic output
      responseSchema: resumeSchema, // resumeSchema is the JSON schema for the expected response
    });

    if (!result) throw new Error("No result from OpenAI");

    const jsonRes = parseAIResponse(result);

    jsonRes._id ||= resume._id; // Ensure the ID is included in the response

    // Send to RabbitMQ queue
    await sendToQueue(RESUME_VALIDATION_QUEUE, jsonRes);
  } catch (error) {
    console.error("Error processing resume:", error);

    // Send to dead letter queue
    await sendToQueue(DEAD_LETTER_QUEUE, resume);
  }
};

export async function setupConsumer() {
  try {
    const channel = await createChannel(true, setupConsumer);
    await channel.assertQueue(RESUME_EXTRACTION_QUEUE, { durable: true });

    for (let i = 0; i < 5; i++) {
      // create a new channel for each consumer
      const channel = await createChannel(true,setupConsumer);

      // consume messages from the queue
      channel.consume(RESUME_EXTRACTION_QUEUE, async (msg: any) => {
        if (msg) {
          const resume = JSON.parse(msg.content);
          await processResume(resume);
          channel.ack(msg);
        }
      });

      console.log(`Consumer listening on queue: ${RESUME_EXTRACTION_QUEUE}`);
    }
  } catch (err) {
    console.error("Error setting up consumer:", err);
  }
}
