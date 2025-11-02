// Server-Sent Events (SSE) utilities for Anthropic-style streaming
import type { FastifyReply } from "fastify";

export function initSSE(res: FastifyReply) {
  res.raw.setHeader("Content-Type", "text/event-stream");
  res.raw.setHeader("Cache-Control", "no-cache, no-transform");
  res.raw.setHeader("Connection", "keep-alive");
  // @ts-ignore
  res.raw.flushHeaders?.();
}

export function sendEvent(res: FastifyReply, event: string, data: unknown) {
  res.raw.write(`event: ${event}\n`);
  res.raw.write(`data: ${JSON.stringify(data)}\n\n`);
}

export function endSSE(res: FastifyReply) {
  res.raw.write("event: done\n");
  res.raw.write("data: {}\n\n");
  res.raw.end();
}

export function startAnthropicMessage(res: FastifyReply, model: string) {
  const id = `msg_${Date.now()}`;
  sendEvent(res, "message_start", {
    type: "message_start",
    message: {
      id,
      type: "message",
      role: "assistant",
      model,
      content: [],
      stop_reason: null,
      stop_sequence: null,
      usage: { input_tokens: 0, output_tokens: 0 }
    }
  });
  sendEvent(res, "content_block_start", {
    type: "content_block_start",
    index: 0,
    content_block: { type: "text", text: "" }
  });
}

export function deltaText(res: FastifyReply, text: string) {
  if (!text) return;
  sendEvent(res, "content_block_delta", {
    type: "content_block_delta",
    index: 0,
    delta: { type: "text_delta", text }
  });
}

export function stopAnthropicMessage(res: FastifyReply) {
  sendEvent(res, "content_block_stop", { type: "content_block_stop", index: 0 });
  sendEvent(res, "message_delta", {
    type: "message_delta",
    delta: { stop_reason: "end_turn", stop_sequence: null },
    usage: { output_tokens: 0 }
  });
  sendEvent(res, "message_stop", { type: "message_stop" });
}
