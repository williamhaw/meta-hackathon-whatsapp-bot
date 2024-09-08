import Replicate from "replicate";
import OpenAI from "openai";

const replicateClient = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const openAiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const runImageModel = async (mediaUrl, incomingMessage) => {
  switch (process.env.IMAGE_MODEL) {
    case "gpt4":
      return runGpt4Image(mediaUrl, incomingMessage);
    case "llava":
      return runLlava(mediaUrl, incomingMessage);
    default:
      return runLlava(mediaUrl, incomingMessage);
  }
};

const runLlava = async (mediaUrl, incomingMessage) => {
  const imageResponse = await replicateClient.run(
    "yorickvp/llava-v1.6-vicuna-13b:0603dec596080fa084e26f0ae6d605fc5788ed2b1a0358cd25010619487eae63",
    {
      input: {
        image: mediaUrl,
        top_p: 1,
        prompt:
          "Please transcribe only the text in the image without disclaimers or explanation",
        history: [],
        max_tokens: 1024,
        temperature: 0.2,
      },
    }
  );
  console.log("llava response:", imageResponse.join(""));
  return imageResponse.join("");
};

const runGpt4Image = async (mediaUrl, incomingMessage) => {
  const completion = await openAiClient.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Please transcribe only the text in the image without disclaimers or explanation",
          },
          { type: "image_url", image_url: { url: mediaUrl } },
        ],
      },
    ],
  });
  console.log(
    "gpt-4o-mini image response:",
    completion.choices[0]?.message?.content
  );
  return completion.choices[0]?.message?.content;
};

const runTextModel = async (prompt) => {
  switch (process.env.TEXT_MODEL) {
    case "gpt4":
      return runGpt4Text(prompt);
    case "llama3":
      return runLlama3(prompt);
    default:
      return runLlama3(prompt);
  }
};

const runLlama3 = async (prompt) => {
  const input = {
    top_p: 0.9,
    prompt,
    max_tokens: 512,
    min_tokens: 0,
    temperature: 0.6,
    prompt_template:
      "<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\nYou are a helpful assistant<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n{prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n",
    presence_penalty: 1.15,
    frequency_penalty: 0.2,
  };

  const botResponse = await replicateClient.run(
    "meta/meta-llama-3.1-405b-instruct",
    { input }
  );
  const formattedResponse = botResponse.join("");
  console.log("Llama response:", formattedResponse);
  return formattedResponse;
};

const runGpt4Text = async (prompt) => {
  const completion = await openAiClient.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [{ type: "text", text: prompt }],
      },
    ],
  });
  console.log(
    "gpt-4o-mini text response:",
    completion.choices[0]?.message?.content
  );
  return completion.choices[0]?.message?.content;
};

export { runImageModel, runTextModel };
