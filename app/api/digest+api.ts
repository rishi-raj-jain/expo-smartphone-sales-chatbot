import { Document } from "langchain/document";
import vectorStoreServer from "~/lib/upstash.server";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";

export async function POST(request: Request): Promise<Response> {
  // Set of messages between user and chatbot
  const { phones = [] } = await request.json();
  // Create the documents to be added to the Upstash Vector Store
  const documents: any[] = [];
  await Promise.all(
    phones.map(async (link: string) => {
      // Use the link to render in the search results
      // Parse the link using Cheerio
      const loader = new CheerioWebBaseLoader(link);
      const scraper = await loader.scrape();
      // Get the content of title tag to render in the search results
      const name = scraper("title").html();
      // Get the page content as string
      const pageContent = scraper.text();
      // Create metadata object to be inserted in the vector store
      const metadata = { link, name };
      documents.push(new Document({ pageContent, metadata }));
    })
  );
  const splitter = new RecursiveCharacterTextSplitter();
  const finalDocs = await splitter.splitDocuments(documents.filter(Boolean));
  // Creating embeddings from the provided documents along with metadata
  // and add them to Upstash database
  await vectorStoreServer.addDocuments(finalDocs, {
    ids: finalDocs.map((_, index) => index.toString()),
  });
  return Response.json({ code: 1 });
}
