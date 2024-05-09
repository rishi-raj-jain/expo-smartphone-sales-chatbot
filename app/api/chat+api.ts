import vectorStoreServer from "~/lib/upstash.server";

export async function POST(request: Request): Promise<Response> {
  // Set of messages between user and chatbot
  const { messages = [] } = await request.json();
  // Get the latest question stored in the last message of the chat array
  const searchQuery = messages[messages.length - 1].content;
  // Perform Similarity Search using the Upstash Vector Store
  const queryResult = await vectorStoreServer.similaritySearchWithScore(
    searchQuery,
    3
  );
  // Filter the records with confidence score > 70% and
  // set the metadata as response to render search results
  const results = queryResult
    .filter((i) => i[1] >= 0.7)
    .map((i) => i[0].metadata);
  // Now use OpenAI Text Completion with relevant articles as context
  const completionCall = await fetch("http://localhost:8787", {
    method: "POST",
    body: JSON.stringify({
      messages: [
        {
          // create a system content message to be added as
          // the open ai text completion will supply it as the context with the API
          role: "system",
          content: `Behave like a Google. You have the knowledge of the following smartphones: ${JSON.stringify(
            results
          )}. Each response should be in 100% markdown format and should have hyperlinks in it. Be precise. Do add some general text in the response related to the query.`,
        },
        // also, pass the whole conversation!
        ...messages,
      ],
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const completionResponse = await completionCall.json();
  return Response.json({ data: { content: completionResponse.response } });
}
