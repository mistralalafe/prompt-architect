import { NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(req: Request) {
  const { userRequest } = await req.json();

  const systemInstruction = `
    You are an expert Prompt Engineer. Transform the user's messy request into a structured, high-quality prompt.
    Use this structure:
    1. Role: Assign a specific persona to the AI.
    2. Context: Define the background.
    3. Task: Clearly state what needs to be done.
    4. Constraints: List what to avoid or follow.
    5. Output Format: Specify how the result should look.
    Return ONLY the final prompt, ready to be copied.
  `;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `${systemInstruction}\n\nUser Request: ${userRequest}` }] }]
    })
  });

  const data = await response.json();
  const refinedPrompt = data.candidates[0].content.parts[0].text;

  return NextResponse.json({ refinedPrompt });
}