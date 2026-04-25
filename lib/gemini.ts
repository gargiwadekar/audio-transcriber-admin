import { GoogleGenAI } from "@google/genai";

import { getEnv } from "@/lib/env";
import { GEMINI_MODEL } from "@/lib/constants";
import { stripMarkdownFences } from "@/lib/utils";

const client = new GoogleGenAI({
  apiKey: getEnv().GEMINI_API_KEY,
});

export async function transcribeAudio(params: {
  audioBuffer: Buffer;
  mimeType: string;
  fileName: string;
}) {
  const base64Audio = params.audioBuffer.toString("base64");

  const response = await client.models.generateContent({
    model: getEnv().GEMINI_MODEL || GEMINI_MODEL,
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType: params.mimeType,
              data: base64Audio,
            },
          },
          {
            text: [
              "Transcribe this audio file accurately.",
              "Return only the spoken transcript as plain text.",
              "Do not add timestamps, speaker labels, markdown, explanations, or formatting.",
              `File name: ${params.fileName}`,
            ].join(" "),
          },
        ],
      },
    ],
  });

  const transcript = stripMarkdownFences(response.text ?? "").trim();

  if (!transcript) {
    throw new Error("Gemini did not return a transcript.");
  }

  return transcript;
}

