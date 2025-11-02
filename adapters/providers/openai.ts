// OpenAI adapter using chat.completions with SSE streaming
import { FastifyReply } from "fastify";
import { createParser } from "eventsource-parser";
import { deltaText, startAnthropicMessage, stopAnthropicMessage } from "../sse.js";
import { toOpenAIMessages } from "../map.js";
import type { AnthropicRequest } from "../types.js";

const OPENAI_BASE = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";

export async function chatOpenAI(
  res: FastifyReply,
  body: AnthropicRequest,
  model: string,
  apiKey?: string
) {
  if (!apiKey) {
    throw withStatus(401, "Missing OPENAI_API_KEY. Set it in ~/.claude-proxy/.env");
  }

  const url = `${OPENAI_BASE}/chat/completions`;

  const oaiBody: any = {
    model,
    messages: toOpenAIMessages(body.messages),
    stream: true,
    temperature: body.temperature ?? 0.7,
    max_tokens: body.max_tokens
  };

  // Pass through tools if provided (note: OpenAI format may differ)
  if (body.tools && body.tools.length > 0) {
    console.warn("[openai] Tools passed through but format may not be compatible");
    oaiBody.tools = body.tools;
  }

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(oaiBody)
  });

  if (!resp.ok || !resp.body) {
    const text = await safeText(resp);
    throw withStatus(resp.status || 500, `OpenAI error: ${text}`);
  }

  // Emit Anthropic SSE start events
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
      // ignore parse errors on keepalives, etc.
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
