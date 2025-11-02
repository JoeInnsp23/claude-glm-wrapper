// Provider parsing and message mapping utilities
import { AnthropicMessage, AnthropicRequest, ProviderKey, ProviderModel } from "./types.js";

const PROVIDER_PREFIXES: ProviderKey[] = ["openai", "openrouter", "gemini", "glm", "anthropic"];

/**
 * Parse provider and model from the model field
 * Supports formats: "provider:model" or "provider/model"
 * Falls back to defaults if no valid prefix found
 */
export function parseProviderModel(modelField: string, defaults?: ProviderModel): ProviderModel {
  if (!modelField) {
    if (defaults) return defaults;
    throw new Error("Missing 'model' in request");
  }

  const sep = modelField.includes(":") ? ":" : modelField.includes("/") ? "/" : null;
  if (!sep) {
    // no prefix: fall back to defaults or assume glm as legacy
    return defaults ?? { provider: "glm", model: modelField };
  }

  const [maybeProv, ...rest] = modelField.split(sep);
  const prov = maybeProv.toLowerCase() as ProviderKey;

  if (!PROVIDER_PREFIXES.includes(prov)) {
    // unrecognized prefix -> use defaults or treat full string as model
    return defaults ?? { provider: "glm", model: modelField };
  }

  return { provider: prov, model: rest.join(sep) };
}

/**
 * Warn if tools are being used with providers that may not support them
 */
export function warnIfTools(req: AnthropicRequest, provider: ProviderKey): void {
  if (req.tools && req.tools.length > 0) {
    // Only GLM and Anthropic support tools natively
    if (provider !== "glm" && provider !== "anthropic") {
      console.warn(`[proxy] Warning: ${provider} may not fully support Anthropic-style tools. Passing through anyway.`);
    }
  }
}

/**
 * Convert Anthropic content to plain text
 */
export function toPlainText(content: AnthropicMessage["content"]): string {
  if (typeof content === "string") return content;
  return content
    .map((c) => {
      if (typeof c === "string") return c;
      if (c.type === "text") return c.text;
      if (c.type === "tool_result") {
        // Convert tool results to text representation
        if (typeof c.content === "string") return c.content;
        return JSON.stringify(c.content);
      }
      return "";
    })
    .join("");
}

/**
 * Convert Anthropic messages to OpenAI format
 */
export function toOpenAIMessages(messages: AnthropicMessage[]) {
  return messages.map((m) => ({
    role: m.role,
    content: toPlainText(m.content)
  }));
}

/**
 * Convert Anthropic messages to Gemini format
 */
export function toGeminiContents(messages: AnthropicMessage[]) {
  return messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: toPlainText(m.content) }]
  }));
}
