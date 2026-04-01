import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { userRequest } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ refinedPrompt: "Error: API Key is missing!" }, { status: 500 });
    }

    // Using the stable v1 endpoint and the explicit model name
    // Try the "latest" alias which auto-resolves to the current working version
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ 
            text: `Structure this into a pro AI prompt with Role, Task, and Constraints: ${userRequest}` 
          }] 
        }]
      })
    });
    
    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ refinedPrompt: `API Error (${data.error.code}): ${data.error.message}` }, { status: 500 });
    }

    const refinedPrompt = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!refinedPrompt) {
      return NextResponse.json({ refinedPrompt: "The AI returned an empty response. Try a different request." }, { status: 500 });
    }

    return NextResponse.json({ refinedPrompt });

  } catch (error) {
    return NextResponse.json({ refinedPrompt: "Connection failed. Please try again." }, { status: 500 });
  }
}