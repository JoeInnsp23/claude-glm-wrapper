// Pass-through adapter for Anthropic-compatible upstreams (Anthropic API and Z.AI GLM)
import { FastifyReply } from "fastify";

type PassArgs = {
  res: FastifyReply;
  body: any;
  model: string;
  baseUrl: string;
  headers: Record<string, string>;
};

/**
 * Pass through requests to Anthropic-compatible APIs
 * This works for both:
 * - Anthropic's official API
 * - Z.AI's GLM API (Anthropic-compatible)
 */
export async function passThrough({ res, body, model, baseUrl, headers }: PassArgs) {
  const url = `${stripEndSlash(baseUrl)}/v1/messages`;

  // Ensure stream is true for Claude Code UX
  body.stream = true;

  const resp = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  });

  if (!resp.ok || !resp.body) {
    const text = await safeText(resp);
    const err = new Error(`Upstream error (${resp.status}): ${text}`);
    // @ts-ignore
    err.statusCode = resp.status || 502;
    throw err;
  }

  // Pipe upstream SSE as-is (already in Anthropic format)
  res.raw.setHeader("Content-Type", "text/event-stream");
  res.raw.setHeader("Cache-Control", "no-cache, no-transform");
  res.raw.setHeader("Connection", "keep-alive");
  // @ts-ignore
  res.raw.flushHeaders?.();

  const reader = resp.body.getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    res.raw.write(value);
  }
  res.raw.end();
}

function stripEndSlash(s: string) {
  return s.endsWith("/") ? s.slice(0, -1) : s;
}

async function safeText(resp: Response) {
  try {
    return await resp.text();
  } catch {
    return "<no-body>";
  }
}
