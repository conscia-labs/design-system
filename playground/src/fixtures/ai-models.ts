export type AiModelFixture = {
  id: string;
  name: string;
  description: string;
  availability: "Available" | "Limited" | "Unavailable";
  availableThrough: string;
  preferredProvider: string;
  capabilities: string[];
  status: "Healthy" | "Degraded" | "Disabled";
  updatedAt: string;
};

export const aiModelFixtures: AiModelFixture[] = [
  {
    id: "ai-model-claude-sonnet-4",
    name: "Claude Sonnet 4",
    description: "Balanced reasoning and coding model for governed enterprise workloads.",
    availability: "Available",
    availableThrough: "Organization policies",
    preferredProvider: "Amazon Bedrock",
    capabilities: ["Text", "Reasoning", "Code"],
    status: "Healthy",
    updatedAt: "2 min ago"
  },
  {
    id: "ai-model-claude-haiku-4",
    name: "Claude Haiku 4",
    description: "Low-latency model for high-volume assistant and automation tasks.",
    availability: "Available",
    availableThrough: "Default developer access",
    preferredProvider: "Amazon Bedrock",
    capabilities: ["Text", "Low latency"],
    status: "Healthy",
    updatedAt: "9 min ago"
  },
  {
    id: "ai-model-nova-pro",
    name: "Nova Pro",
    description: "General-purpose multimodal model available to approved groups.",
    availability: "Limited",
    availableThrough: "Applied policies",
    preferredProvider: "Amazon Bedrock",
    capabilities: ["Text", "Vision"],
    status: "Degraded",
    updatedAt: "18 min ago"
  },
  {
    id: "ai-model-titan-embed",
    name: "Titan Embeddings",
    description: "Embedding model for search, retrieval, and classification workloads.",
    availability: "Available",
    availableThrough: "Organization policies",
    preferredProvider: "Amazon Bedrock",
    capabilities: ["Embeddings"],
    status: "Healthy",
    updatedAt: "24 min ago"
  },
  {
    id: "ai-model-legacy-chat",
    name: "Legacy Chat",
    description: "Deprecated compatibility model retained for migration support.",
    availability: "Unavailable",
    availableThrough: "No active policy",
    preferredProvider: "Amazon Bedrock",
    capabilities: ["Text"],
    status: "Disabled",
    updatedAt: "1 hour ago"
  }
];
