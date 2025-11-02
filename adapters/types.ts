// TypeScript type definitions for Anthropic API subset
// Used across all adapter files

export type AnthropicContentBlock =
  | { type: "text"; text: string }
  | { type: "image"; source: { type: "base64"; media_type: string; data: string } }
  | { type: "tool_use"; id: string; name: string; input: unknown }
  | { type: "tool_result"; tool_use_id: string; content: string | unknown[] };

export type AnthropicMessage = {
  role: "user" | "assistant";
  content: string | AnthropicContentBlock[];
};

export type AnthropicTool = {
  name: string;
  description?: string;
  input_schema?: unknown;
};

export type AnthropicRequest = {
  model: string;
  messages: AnthropicMessage[];
  max_tokens?: number;
  temperature?: number;
  stream?: boolean;
  tools?: AnthropicTool[];
  system?: string;
};

export type ProviderKey = "openai" | "openrouter" | "gemini" | "glm" | "anthropic";

export type ProviderModel = {
  provider: ProviderKey;
  model: string;
};
