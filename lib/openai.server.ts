import { OpenAIEmbeddings } from "@langchain/openai";

// Instantiate class to generate embeddings using the OpenAI API
export default new OpenAIEmbeddings({
  modelName: "text-embedding-3-small",
  openAIApiKey: process.env.OPENAI_API_KEY,
});
