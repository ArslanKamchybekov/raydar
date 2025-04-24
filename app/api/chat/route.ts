import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { getFoundItems } from "@/app/actions/foundItems";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const query = messages[messages.length - 1].content;

  // Step 1: Check Supabase for lost items
  const items = await getFoundItems();

  let systemMessage = "You are a helpful assistant for the Lost & Found system. Your primary goal is to help users locate their missing items and guide them through the claim process. ";

  if (items && items.length > 0) {
    systemMessage += `

I've found these potential matches to your query: 
${items.map(i => `- ${i.category}${i.brand ? ` (${i.brand})` : ''} at ${i.location}, found on ${new Date(i.created_at).toLocaleDateString()}. Item ID: ${i.id}`).join("\n")}

If any of these items might be yours, please:
1. Let me know which item(s) you're interested in
2. Provide specific details about your lost item that only the owner would know
3. Submit a claim through our system by clicking on the item and selecting "Submit Claim"

The claim process requires verification to ensure items are returned to their rightful owners. Be prepared to describe unique identifying features or provide proof of ownership.`;
  } else {
    systemMessage += `

I couldn't find any items matching your description in our database. Here are some suggestions:
1. Try describing your item with different keywords or more details
2. Set up an alert to be notified when matching items are found
3. Check back regularly as new items are added daily
4. Consider filing a report with campus security if your item is valuable

If you'd like to create an alert for your missing item, I can guide you through that process.`;
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