// Gemini adapter using streamGenerateContent (SSE)
import { FastifyReply } from "fastify";
import { createParser } from "eventsource-parser";
import { deltaText, startAnthropicMessage, stopAnthropicMessage } from "../sse.js";
import { toGeminiContents } from "../map.js";
import type { AnthropicRequest } from "../types.js";

const G_BASE = process.env.GEMINI_BASE_URL || "https://generativelanguage.googleapis.com/v1beta";

export async function chatGemini(
  res: FastifyReply,
  body: AnthropicRequest,
  model: string,
  apiKey?: string
) {
  if (!apiKey) {
    throw withStatus(401, "Missing GEMINI_API_KEY. Set it in ~/.claude-proxy/.env");
  }

  const url = `${G_BASE}/models/${encodeURIComponent(model)}:streamGenerateContent?alt=sse&key=${apiKey}`;

  const reqBody: any = {
    contents: toGeminiContents(body.messages),
    generationConfig: {
      temperature: body.temperature ?? 0.7,
      maxOutputTokens: body.max_tokens
    }
  };

  // Note: Gemini has different tool format, just warn for now
  if (body.tools && body.tools.length > 0) {
    console.warn("[gemini] Tools not yet adapted to Gemini format, skipping");
  }

  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reqBody)
  });

  if (!resp.ok || !resp.body) {
    const text = await safeText(resp);
    throw withStatus(resp.status || 500, `Gemini error: ${text}`);
  }

  startAnthropicMessage(res, model);

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  const parser = createParser((event) => {
    if (event.type !== "event") return;
    const data = event.data;
    if (!data) return;
    try {
      const json = JSON.parse(data);
      // Gemini response: candidates[0].content.parts[].text
      const text =
        json?.candidates?.[0]?.content?.parts
          ?.map((p: any) => p?.text || "")
          .join("") || "";
      if (text) deltaText(res, text);
    } catch {
      // ignore parse errors
    }
  });

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    parser.feed(decoder.decode(value));
  }

  stopAnthropicMessage(res);
}

function withStatus(status: number, message: string) {
  const e = new Error(message);
  // @ts-ignore
  e.statusCode = status;
  return e;
}

async function safeText(resp: Response) {
  try {
    return await resp.text();
  } catch {
    return "<no-body>";
  }
}
