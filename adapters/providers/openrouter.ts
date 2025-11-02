// OpenRouter adapter (OpenAI-compatible API)
import { FastifyReply } from "fastify";
import { createParser } from "eventsource-parser";
import { deltaText, startAnthropicMessage, stopAnthropicMessage } from "../sse.js";
import { toOpenAIMessages } from "../map.js";
import type { AnthropicRequest } from "../types.js";

const OR_BASE = process.env.OPENROUTER_BASE_URL || "https://openrouter.ai/api/v1";

export async function chatOpenRouter(
  res: FastifyReply,
  body: AnthropicRequest,
  model: string,
  apiKey?: string
) {
  if (!apiKey) {
    throw withStatus(401, "Missing OPENROUTER_API_KEY. Set it in ~/.claude-proxy/.env");
  }

  const url = `${OR_BASE}/chat/completions`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json"
  };

  // Add optional OpenRouter headers
  if (process.env.OPENROUTER_REFERER) {
    headers["HTTP-Referer"] = process.env.OPENROUTER_REFERER;
  }
  if (process.env.OPENROUTER_TITLE) {
    headers["X-Title"] = process.env.OPENROUTER_TITLE;
  }

  const reqBody: any = {
    model,
    messages: toOpenAIMessages(body.messages),
    stream: true,
    temperature: body.temperature ?? 0.7,
    max_tokens: body.max_tokens
  };

  // Pass through tools if provided
  if (body.tools && body.tools.length > 0) {
    console.warn("[openrouter] Tools passed through but format may not be compatible");
    reqBody.tools = body.tools;
  }

  const resp = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(reqBody)
  });

  if (!resp.ok || !resp.body) {
    const text = await safeText(resp);
    throw withStatus(resp.status || 500, `OpenRouter error: ${text}`);
  }

  startAnthropicMessage(res, model);

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  const parser = createParser((event) => {
    if (event.type !== "event") return;
    const data = event.data;
    if (!data || data === "[DONE]") return;
    try {
      const json = JSON.parse(data);
      const chunk = json.choices?.[0]?.delta?.content ?? "";
      if (chunk) deltaText(res, chunk);
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
