import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userRequest } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ refinedPrompt: "Error: API Key is missing in Vercel settings!" }, { status: 500 });
    }

    const systemInstruction = `You are an expert Prompt Engineer. Transform the user's messy request into a structured, high-quality prompt. Return ONLY the final prompt.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${systemInstruction}\n\nUser Request: ${userRequest}` }] }]
      })
    });

    const data = await response.json();

    // Check if the API returned an error message
    if (data.error) {
      return NextResponse.json({ refinedPrompt: `API Error: ${data.error.message}` }, { status: 500 });
    }

    // Safely check for the candidates path
    const refinedPrompt = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!refinedPrompt) {
      return NextResponse.json({ refinedPrompt: "The AI didn't return a result. Check your safety settings or input." }, { status: 500 });
    }

    return NextResponse.json({ refinedPrompt });

  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ refinedPrompt: "Server error occurred. Check Vercel logs." }, { status: 500 });
  }
}