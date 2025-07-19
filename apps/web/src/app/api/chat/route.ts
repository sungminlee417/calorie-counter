import { NextRequest } from "next/server";
import { streamText, UIMessage } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    if (!Array.isArray(messages)) {
      return new Response("Invalid messages format", { status: 400 });
    }

    const result = streamText({
      model: openai("gpt-3.5-turbo"),
      system: "You are a helpful assistant.",
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Error in /api/chat:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
