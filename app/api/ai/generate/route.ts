import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = "force-dynamic";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API Key not configured" },
        { status: 500 }
      );
    }

    const { content, mode, platform } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: "กรุณาใส่ข้อความต้นฉบับ" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Construct the prompt
    let prompt = `You are a Thai social media expert copywriter. Rewrite the user's content to be engaging, natural, and suitable for the specified platform.\n\n`;
    prompt += `Original content: "${content}"\nPlatform: ${platform || "General"}\n`;

    switch (mode) {
      case "fix_grammar":
        prompt += "Goal: Fix grammar and make it sound professional yet friendly.";
        break;
      case "make_shorter":
        prompt += "Goal: Summarize it, make it punchy and short.";
        break;
      case "make_exciting":
        prompt += "Goal: Add excitement, emojis, and a call to action. Make it viral!";
        break;
      case "sell_hard":
        prompt += "Goal: Focus on sales, scarcity, and clear CTA. Use persuasive language.";
        break;
      default: // 'rewrite'
        prompt += "Goal: Rewrite it to be more engaging and readable.";
    }

    prompt += "\nReply ONLY with the rewritten Thai text. Do not add explanations or quotes.";

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text().trim();

    return NextResponse.json({ result: generatedText });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    console.error("AI Generate Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
