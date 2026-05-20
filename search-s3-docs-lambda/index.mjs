import {
  BedrockAgentRuntimeClient,
  RetrieveCommand,
} from "@aws-sdk/client-bedrock-agent-runtime";

const bedrock = new BedrockAgentRuntimeClient({
  region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION,
});

const KNOWLEDGE_BASE_ID = process.env.BEDROCK_KNOWLEDGE_BASE_ID;
const MAX_CHUNKS_RETURN = Number(process.env.MAX_CHUNKS_RETURN || 6);
const MIN_SCORE = Number(process.env.MIN_SCORE || 0);

const corsHeaders = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": process.env.CORS_ORIGIN || "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "OPTIONS,POST",
};

const response = (statusCode, payload) => ({
  statusCode,
  headers: corsHeaders,
  body: typeof payload === "string" ? payload : JSON.stringify(payload),
});

const safeJsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const getBody = (event) => {
  if (!event?.body) return {};

  if (typeof event.body === "object") return event.body;

  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf-8")
    : event.body;

  return safeJsonParse(rawBody) || {};
};

const getSourceUri = (item) => {
  return (
    item.location?.s3Location?.uri ||
    item.location?.webLocation?.url ||
    item.location?.customDocumentLocation?.id ||
    "unknown"
  );
};

const getText = (item) => {
  return item.content?.text || "";
};

const buildContext = (chunks) => {
  return chunks
    .map((item, index) => {
      const sourceUri = getSourceUri(item);
      const text = getText(item);
      const score = item.score ?? "";

      return [
        `SOURCE: ${sourceUri}`,
        `CHUNK: ${index}`,
        score !== "" ? `SCORE: ${score}` : null,
        text,
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n\n---\n\n");
};

export const handler = async (event) => {
  try {
    const method = event?.requestContext?.http?.method || event?.httpMethod;

    if (method === "OPTIONS") {
      return response(200, "");
    }

    if (!KNOWLEDGE_BASE_ID) {
      return response(500, {
        message: "Missing BEDROCK_KNOWLEDGE_BASE_ID environment variable",
      });
    }

    const body = getBody(event);
    const question = body.question || body.text || body.message;

    if (!question || !String(question).trim()) {
      return response(400, {
        message: "Missing question",
      });
    }

    const command = new RetrieveCommand({
      knowledgeBaseId: KNOWLEDGE_BASE_ID,
      retrievalQuery: {
        text: String(question),
      },
      retrievalConfiguration: {
        vectorSearchConfiguration: {
          numberOfResults: MAX_CHUNKS_RETURN,
        },
      },
    });

    const result = await bedrock.send(command);

    const rawChunks = result.retrievalResults || [];

    const topChunks = rawChunks.filter((item) => {
      if (!item.score && item.score !== 0) return true;
      return item.score >= MIN_SCORE;
    });

    const context = buildContext(topChunks);

    return response(200, {
      question,
      context,
      sources: [
        ...new Set(
          topChunks
            .map((item) => getSourceUri(item))
            .filter((uri) => uri && uri !== "unknown"),
        ),
      ],
      chunks: topChunks.map((item, index) => ({
        index,
        score: item.score,
        text: getText(item),
        sourceUri: getSourceUri(item),
        metadata: item.metadata || {},
      })),
      noMatch: topChunks.length === 0,
      message:
        topChunks.length === 0
          ? "No relevant document chunks found for this question."
          : undefined,
      debug: {
        knowledgeBaseId: KNOWLEDGE_BASE_ID,
        totalChunksReturned: rawChunks.length,
        chunksUsed: topChunks.length,
      },
    });
  } catch (err) {
    console.error(err);

    return response(500, {
      message: "Internal error",
      error: err?.message || String(err),
    });
  }
};
