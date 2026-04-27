import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

const s3 = new S3Client({
  region: process.env.AWS_REGION || "us-west-2",
});

const BUCKET_NAME = process.env.BUCKET_NAME;
const LOG_SECRET = process.env.LOG_SECRET;

export const handler = async (event) => {
  try {
    if (
      event.requestContext?.http?.method === "OPTIONS" ||
      event.httpMethod === "OPTIONS"
    ) {
      return response(200, { message: "OK" });
    }

    const headers = event.headers || {};
    const incomingSecret =
      headers["x-log-secret"] ||
      headers["X-Log-Secret"] ||
      headers["X-LOG-SECRET"];

    if (!LOG_SECRET || incomingSecret !== LOG_SECRET) {
      return response(401, { message: "Unauthorized" });
    }

    if (!BUCKET_NAME) {
      return response(500, {
        message: "Missing BUCKET_NAME environment variable",
      });
    }

    const body =
      typeof event.body === "string"
        ? JSON.parse(event.body || "{}")
        : event.body || {};

    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, "0");
    const day = String(now.getUTCDate()).padStart(2, "0");

    const logType = getLogType(body.type);

    const userId = sanitize(
      body.user?.id ||
        body.userId ||
        body.callback_query?.from?.id ||
        "unknown-user",
    );

    const messageId = sanitize(
      body.message?.id ||
        body.relatedMessage?.id ||
        body.messageId ||
        Date.now(),
    );

    const uniqueId = crypto.randomUUID();

    const key = [
      "telegram",
      `type=${logType}`,
      `year=${year}`,
      `month=${month}`,
      `day=${day}`,
      `userId=${userId}`,
      `${Date.now()}-${messageId}-${uniqueId}.json`,
    ].join("/");

    const logData =
      logType === "feedback"
        ? buildFeedbackLog(body, now)
        : buildInteractionLog(body, now);

    await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: JSON.stringify(logData, null, 2),
        ContentType: "application/json",
      }),
    );

    return response(200, {
      message: "Log saved",
      type: logType,
      key,
    });
  } catch (error) {
    console.error("Save log error:", error);

    return response(500, {
      message: "Failed to save log",
      error: error.message,
    });
  }
};

function getLogType(type) {
  if (type === "chatbot_feedback") return "feedback";
  return "interactions";
}

function buildInteractionLog(body, now) {
  return {
    source: body.source || "telegram",
    type: body.type || "chatbot_interaction",
    environment: body.environment || "dev",

    user: body.user || {
      id: body.userId || null,
      firstName: body.firstName || "",
      lastName: body.lastName || "",
      username: body.username || "",
    },

    chat: body.chat || {
      id: body.chatId || null,
      type: body.chatType || "private",
    },

    message: body.message || {
      id: body.messageId || null,
      question: body.userMessage || body.question || "",
      timestamp: body.messageTimestamp || null,
    },

    bot: body.bot || {
      answer: body.botReply || body.answer || "",
      provider: body.provider || "",
      model: body.model || "",
    },

    rag: buildRagLog(body),

    router: body.router || null,
    memory: body.memory || null,
    route: body.route || null,
    status: body.status || "success",
    error: body.error || null,
    loggedAt: now.toISOString(),
  };
}

function buildFeedbackLog(body, now) {
  return {
    source: body.source || "telegram",
    type: "chatbot_feedback",
    environment: body.environment || "dev",

    user: body.user || {
      id: body.userId || null,
      firstName: body.firstName || "",
      lastName: body.lastName || "",
      username: body.username || "",
    },

    chat: body.chat || {
      id: body.chatId || null,
      type: body.chatType || "private",
    },

    feedback: body.feedback || {
      value: body.feedbackValue || "",
      callbackData: body.callbackData || "",
    },

    relatedMessage: body.relatedMessage || {
      id: body.relatedMessageId || null,
      text: body.relatedMessageText || "",
    },

    status: body.status || "success",
    error: body.error || null,
    loggedAt: now.toISOString(),
  };
}

function buildRagLog(body) {
  const rawRag = body.rag || {};

  const sources = normalizeSourceList(
    rawRag.sources || body.sources || body.ragSources || [],
  );

  return {
    used: rawRag.used ?? body.ragUsed ?? false,
    query:
      rawRag.query ||
      body.ragQuery ||
      body.message?.question ||
      body.userMessage ||
      body.question ||
      "",
    usedFallback: rawRag.usedFallback ?? body.usedFallback ?? false,
    docsFound: rawRag.docsFound ?? body.docsFound ?? sources.length,
    sources,
  };
}

function normalizeSourceList(sources) {
  if (!sources) return [];

  let list = sources;

  if (typeof sources === "string") {
    try {
      const parsed = JSON.parse(sources);
      list = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      list = [sources];
    }
  }

  if (!Array.isArray(list)) list = [list];

  return [
    ...new Set(
      list
        .filter(Boolean)
        .map((source) => String(source).trim())
        .filter(Boolean),
    ),
  ];
}

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type,x-log-secret",
      "Access-Control-Allow-Methods": "POST,OPTIONS",
    },
    body: JSON.stringify(body),
  };
}

function sanitize(value) {
  return String(value)
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .slice(0, 100);
}
