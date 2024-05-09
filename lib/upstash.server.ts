import embeddings from "~/lib/openai.server";
import { Index as UpstashIndex } from "@upstash/vector";
import { UpstashVectorStore } from "@langchain/community/vectorstores/upstash";

// Instantiate the Upstash Vector Index
const index = new UpstashIndex({
  url: process.env.UPSTASH_VECTOR_REST_URL as string,
  token: process.env.UPSTASH_VECTOR_REST_TOKEN as string,
});

// Instantiate the Upstash Vector Store that'll create and save embeddings
export default new UpstashVectorStore(embeddings, { index });
