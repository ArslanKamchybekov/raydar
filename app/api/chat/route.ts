import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { getFoundItems } from "@/app/actions/foundItems";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const query = messages[messages.length - 1].content;

  // Step 1: Check Supabase for lost items
  const items = await getFoundItems();

  let systemMessage = "You are a helpful assistant for a lost and found system. ";

  if (items && items.length > 0) {
    systemMessage += `We found these matching items: ${items.map(i => `${i.description} at ${i.location} (Found: ${i.created_at})`).join(", ")}. Please inform the user about these items and ask if they need more information.`;
  } else {
    systemMessage += "If no items are found matching the query, provide a sympathetic response and suggest next steps.";
  }

  const result = streamText({
    model: openai('gpt-4-turbo'),
    messages: [
      { role: "system", content: systemMessage },
      ...messages
    ],
  });

  return result.toDataStreamResponse();
}