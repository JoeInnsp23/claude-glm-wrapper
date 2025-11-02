// Main Fastify server that routes requests by provider prefix
import Fastify from "fastify";
import { parseProviderModel, warnIfTools } from "./map.js";
import type { AnthropicRequest, ProviderModel } from "./types.js";
import { chatOpenAI } from "./providers/openai.js";
import { chatOpenRouter } from "./providers/openrouter.js";
import { chatGemini } from "./providers/gemini.js";
import { passThrough } from "./providers/anthropic-pass.js";
import { config } from "dotenv";
import { join } from "path";
import { homedir } from "os";

// Load .env from ~/.claude-proxy/.env
const envPath = join(homedir(), ".claude-proxy", ".env");
config({ path: envPath });

const PORT = Number(process.env.CLAUDE_PROXY_PORT || 17870);

let active: ProviderModel | null = null;

const fastify = Fastify({ logger: false });

// Health check endpoint
fastify.get("/healthz", async () => ({
  ok: true,
  active: active ?? { provider: "glm", model: "auto" }
}));

// Status endpoint (shows current active provider/model)
fastify.get("/_status", async () => {
  return active ?? { provider: "glm", model: "glm-4.6" };
});

// Main messages endpoint - routes by model prefix
fastify.post("/v1/messages", async (req, res) => {
  try {
    const body = req.body as AnthropicRequest;
    const defaults = active ?? undefined;
    const { provider, model } = parseProviderModel(body.model, defaults);

    // Warn if using tools with providers that may not support them
    warnIfTools(body, provider);

    active = { provider, model };

    // Always stream for Claude Code
    res.raw.setHeader("Content-Type", "text/event-stream");
    res.raw.setHeader("Cache-Control", "no-cache, no-transform");
    res.raw.setHeader("Connection", "keep-alive");
    // @ts-ignore
    res.raw.flushHeaders?.();

    if (provider === "openai") {
      const key = process.env.OPENAI_API_KEY;
      if (!key) {
        throw apiError(401, "OPENAI_API_KEY not set in ~/.claude-proxy/.env");
      }
      return chatOpenAI(res, body, model, key);
    }

    if (provider === "openrouter") {
      const key = process.env.OPENROUTER_API_KEY;
      if (!key) {
        throw apiError(401, "OPENROUTER_API_KEY not set in ~/.claude-proxy/.env");
      }
      return chatOpenRouter(res, body, model, key);
    }

    if (provider === "gemini") {
      const key = process.env.GEMINI_API_KEY;
      if (!key) {
        throw apiError(401, "GEMINI_API_KEY not set in ~/.claude-proxy/.env");
      }
      return chatGemini(res, body, model, key);
    }

    if (provider === "anthropic") {
      const base = process.env.ANTHROPIC_UPSTREAM_URL;
      const key = process.env.ANTHROPIC_API_KEY;
      if (!base || !key) {
        throw apiError(
          500,
          "ANTHROPIC_UPSTREAM_URL and ANTHROPIC_API_KEY not set in ~/.claude-proxy/.env"
        );
      }
      return passThrough({
        res,
        body,
        model,
        baseUrl: base,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
          "anthropic-version": process.env.ANTHROPIC_VERSION || "2023-06-01"
        }
      });
    }

    // Default: glm (Z.AI)
    const glmBase = process.env.GLM_UPSTREAM_URL;
    const glmKey = process.env.ZAI_API_KEY || process.env.GLM_API_KEY;
    if (!glmBase || !glmKey) {
      throw apiError(
        500,
        "GLM_UPSTREAM_URL and ZAI_API_KEY not set in ~/.claude-proxy/.env. Run: ccx --setup"
      );
    }
    return passThrough({
      res,
      body,
      model,
      baseUrl: glmBase,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${glmKey}`,
        "anthropic-version": process.env.ANTHROPIC_VERSION || "2023-06-01"
      }
    });
  } catch (e: any) {
    const status = e?.statusCode ?? 500;
    return res.code(status).send({ error: e?.message || "proxy error" });
  }
});

function apiError(status: number, message: string) {
  const e = new Error(message);
  // @ts-ignore
  e.statusCode = status;
  return e;
}

fastify
  .listen({ port: PORT, host: "127.0.0.1" })
  .then(() => {
    console.log(`[ccx] Proxy listening on http://127.0.0.1:${PORT}`);
    console.log(`[ccx] Configure API keys in: ${envPath}`);
  })
  .catch((err) => {
    console.error("[ccx] Failed to start proxy:", err.message);
    process.exit(1);
  });
