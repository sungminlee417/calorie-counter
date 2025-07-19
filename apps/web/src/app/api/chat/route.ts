
// import { generateText } from 'ai';
// import OpenAI from 'openai';
// import { createFood, addEntry } from '@/lib/aiTools';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY!,
// });

// export async function POST(req: Request) {
//   const { messages } = await req.json();

//   const response = await openai.chat.completions.create({
//     model: 'gpt-4-0613',
//     stream: true,
//     messages,
//     tools,
//     tool_choice: "auto",
//   });

//   const stream = OpenAIStream(response, {
//     async onToolCall(toolCall) {
//       const { name, arguments: args } = toolCall;
//       if (name === 'createFood') {
//         const result = await createFood(JSON.parse(args));
//         return { result };
//       }
//       if (name === 'addEntry') {
//         const result = await addEntry(JSON.parse(args));
//         return { result };
//       }
//     },
//   });

//   return new StreamingTextResponse(stream);
// }
