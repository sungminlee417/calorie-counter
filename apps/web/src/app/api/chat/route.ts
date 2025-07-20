import { NextRequest } from "next/server";
import { streamText, UIMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import outdent from "outdent";

import { CreateFoodToolManager } from "@/lib/ai/tools/create-food-tool-manager";
import { SearchFoodToolManager } from "@/lib/ai/tools/search-food-tool-manager";
import { CreateFoodEntryToolManager } from "@/lib/ai/tools/create-food-entry-tool-manager";

const createFoodTool = new CreateFoodToolManager();
const createFoodEntryTool = new CreateFoodEntryToolManager();
const searchFoodTool = new SearchFoodToolManager();

export async function POST(req: NextRequest) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    if (!Array.isArray(messages)) {
      return new Response("Invalid messages format", { status: 400 });
    }

    const result = streamText({
      model: openai("gpt-4o-mini"),
      system: outdent`
        You are a friendly and knowledgeable nutrition assistant.
        Help users track their daily macros by searching for foods, creating new food entries, and logging food intake accurately.
        Use the available tools to find detailed food information, add new foods if they are missing, and log food consumption.
        Always be clear, concise, and supportive, encouraging healthy eating habits and precise tracking.`,
      messages,
      tools: {
        [createFoodTool.name]: createFoodTool.tool(),
        [createFoodEntryTool.name]: createFoodEntryTool.tool(),
        [searchFoodTool.name]: searchFoodTool.tool(),
      },
      maxSteps: 5,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
