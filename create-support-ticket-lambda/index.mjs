import { MongoClient } from "mongodb";

const {
  MONGODB_URI,
  MONGODB_DB_NAME = "taskio",
  TICKET_COLLECTION_NAME = "tickets",
} = process.env;

let cachedClient = null;

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
  "Access-Control-Allow-Methods": "OPTIONS,POST",
};

const parseBody = (event) => {
  if (!event?.body) return {};
  if (typeof event.body === "object") return event.body;

  try {
    return JSON.parse(event.body);
  } catch {
    return {};
  }
};

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const getMongoClient = async () => {
  if (cachedClient) return cachedClient;

  cachedClient = new MongoClient(MONGODB_URI, {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
  });

  await cachedClient.connect();
  return cachedClient;
};

export const handler = async (event) => {
  try {
    if (event?.requestContext?.http?.method === "OPTIONS") {
      return {
        statusCode: 200,
        headers,
        body: "",
      };
    }

    if (!MONGODB_URI) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          message: "Missing MONGODB_URI environment variable",
        }),
      };
    }

    const body = parseBody(event);

    const {
      email,
      issue,
      description,
      priority = "Bình thường",
      telegramUserId,
      telegramUsername,
      originalMessage,
    } = body;

    if (!email || !isValidEmail(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message: "Invalid or missing email",
        }),
      };
    }

    if (!issue || !description) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          message: "Missing issue or description",
        }),
      };
    }

    const now = new Date();

    const ticket = {
      email,
      title: issue,
      type: "support",
      content: [
        `Mô tả: ${description}`,
        `Mức độ: ${priority}`,
        "",
        `Nguồn: Telegram Bot / n8n`,
        `Telegram user id: ${telegramUserId || ""}`,
        `Telegram username: ${telegramUsername || ""}`,
        "",
        "Original message:",
        originalMessage || "",
      ].join("\n"),
      handlerId: "",
      status: "pending",
      createdBy: "n8n",
      createdAt: now,
      updatedAt: null,
    };

    const client = await getMongoClient();
    const db = client.db(MONGODB_DB_NAME);

    const result = await db
      .collection(TICKET_COLLECTION_NAME)
      .insertOne(ticket);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "Ticket created successfully",
        ticketId: result.insertedId.toString(),
        ticket,
      }),
    };
  } catch (err) {
    console.error(err);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: "Internal error",
        error: err.message,
      }),
    };
  }
};
