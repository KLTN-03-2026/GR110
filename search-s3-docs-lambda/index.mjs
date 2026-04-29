import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION,
});

const BUCKET = process.env.DOCS_BUCKET;

const PREFIXES = (process.env.DOCS_PREFIXES || "guide/,policies/,support/")
  .split(",")
  .map((p) => p.trim())
  .filter(Boolean);

const MAX_FILES = Number(process.env.MAX_FILES || 120);
const MAX_CHUNKS_RETURN = Number(process.env.MAX_CHUNKS_RETURN || 6);
const CHUNK_MAX_LENGTH = Number(process.env.CHUNK_MAX_LENGTH || 1400);
const CHUNK_OVERLAP = Number(process.env.CHUNK_OVERLAP || 180);
const CACHE_TTL_MS = Number(process.env.CACHE_TTL_MS || 5 * 60 * 1000);
const MIN_SCORE = Number(process.env.MIN_SCORE || 4);
const ALLOW_FALLBACK = String(process.env.ALLOW_FALLBACK || "false") === "true";

let cachedDocs = null;
let cachedAt = 0;
let loadingPromise = null;

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

const streamToString = async (stream) => {
  const chunks = [];

  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  return Buffer.concat(chunks).toString("utf-8");
};

const normalize = (text = "") =>
  String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/\s+/g, " ")
    .trim();

const cleanText = (text) =>
  String(text || "")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

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

const extractJsonText = (json) => {
  if (!json) return "";

  if (typeof json === "string") return json;

  if (Array.isArray(json)) {
    return json.map(extractJsonText).filter(Boolean).join("\n\n");
  }

  if (typeof json === "object") {
    const preferredFields = [
      "title",
      "heading",
      "question",
      "answer",
      "content",
      "body",
      "text",
      "description",
    ];

    const preferred = preferredFields
      .map((key) => json[key])
      .filter(Boolean)
      .map(extractJsonText)
      .filter(Boolean)
      .join("\n\n");

    if (preferred) return preferred;

    return Object.values(json)
      .map(extractJsonText)
      .filter(Boolean)
      .join("\n\n");
  }

  return String(json);
};

const parseObjectText = (key, raw) => {
  if (/\.json$/i.test(key)) {
    const parsed = safeJsonParse(raw);
    return cleanText(extractJsonText(parsed) || raw);
  }

  return cleanText(raw);
};

const stopWords = new Set([
  "la",
  "gi",
  "cai",
  "nay",
  "do",
  "toi",
  "minh",
  "ban",
  "co",
  "khong",
  "lam",
  "sao",
  "nhu",
  "the",
  "nao",
  "duoc",
  "ve",
  "cho",
  "hoi",
  "hay",
  "can",
  "muon",
  "xem",
  "noi",
  "mot",
  "cac",
  "nhung",
  "va",
  "thi",
  "neu",
  "khi",
  "de",
  "trong",
  "ngoai",
  "voi",
  "tu",
  "ra",
  "please",
  "help",
  "how",
  "what",
  "when",
  "where",
  "why",
  "is",
  "are",
  "the",
  "a",
  "an",
  "to",
  "for",
  "of",
  "in",
  "on",
  "and",
  "or",
]);

const tokenize = (text) => {
  const normalized = normalize(text);

  return normalized
    .replace(/[^\p{L}\p{N}\s_-]/gu, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 2 && !stopWords.has(w));
};

const getKeywords = (question) => {
  const words = tokenize(question);

  if (words.length > 0) {
    return [...new Set(words)];
  }

  return [
    ...new Set(
      normalize(question)
        .replace(/[^\p{L}\p{N}\s_-]/gu, " ")
        .split(/\s+/)
        .filter((w) => w.length >= 2),
    ),
  ];
};

const getPhrases = (question) => {
  const words = tokenize(question);
  const phrases = [];

  for (let size = 2; size <= 4; size++) {
    for (let i = 0; i <= words.length - size; i++) {
      phrases.push(words.slice(i, i + size).join(" "));
    }
  }

  return [...new Set(phrases)];
};

const getHeading = (chunk) => {
  const line = chunk.split("\n").find(Boolean) || "";
  return /^#{1,6}\s+/.test(line) ? line.replace(/^#{1,6}\s+/, "").trim() : "";
};

const splitLongPartWithOverlap = (part, maxLength, overlap) => {
  const chunks = [];
  let start = 0;

  while (start < part.length) {
    const end = Math.min(start + maxLength, part.length);
    chunks.push(part.slice(start, end).trim());

    if (end >= part.length) break;
    start = Math.max(0, end - overlap);
  }

  return chunks.filter(Boolean);
};

const splitMarkdownSmart = (text, maxLength = CHUNK_MAX_LENGTH) => {
  const cleaned = cleanText(text);
  if (!cleaned) return [];

  const sections = cleaned
    .split(/\n(?=#{1,6}\s+)/g)
    .map((s) => s.trim())
    .filter(Boolean);

  const baseParts =
    sections.length > 1
      ? sections
      : cleaned
          .split(/\n\s*\n/)
          .map((s) => s.trim())
          .filter(Boolean);

  const chunks = [];
  let current = "";

  for (const part of baseParts) {
    if (part.length > maxLength) {
      if (current.trim()) {
        chunks.push(current.trim());
        current = "";
      }

      chunks.push(...splitLongPartWithOverlap(part, maxLength, CHUNK_OVERLAP));
      continue;
    }

    const next = current ? `${current}\n\n${part}` : part;

    if (next.length > maxLength) {
      if (current.trim()) chunks.push(current.trim());
      current = part;
    } else {
      current = next;
    }
  }

  if (current.trim()) chunks.push(current.trim());

  return chunks;
};

const listDocKeys = async () => {
  const seen = new Set();
  const keys = [];

  for (const prefix of PREFIXES) {
    let token;

    do {
      const result = await s3.send(
        new ListObjectsV2Command({
          Bucket: BUCKET,
          Prefix: prefix,
          ContinuationToken: token,
          MaxKeys: 1000,
        }),
      );

      for (const item of result.Contents || []) {
        const key = item.Key;

        if (
          key &&
          !seen.has(key) &&
          !key.endsWith("/") &&
          /\.(md|txt|json)$/i.test(key)
        ) {
          seen.add(key);
          keys.push(key);
        }

        if (keys.length >= MAX_FILES) {
          return keys;
        }
      }

      token = result.NextContinuationToken;
    } while (token);
  }

  return keys;
};

const getObjectText = async (key) => {
  const result = await s3.send(
    new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
    }),
  );

  const raw = await streamToString(result.Body);
  return parseObjectText(key, raw);
};

const buildDocs = async () => {
  const keys = await listDocKeys();
  const docs = [];

  await Promise.all(
    keys.map(async (key) => {
      try {
        const raw = await getObjectText(key);
        const chunks = splitMarkdownSmart(raw);

        chunks.forEach((chunk, index) => {
          const heading = getHeading(chunk);

          docs.push({
            key,
            chunkIndex: index,
            heading,
            text: chunk,
            normalizedText: normalize(chunk),
            normalizedKey: normalize(key),
            normalizedHeading: normalize(heading),
          });
        });
      } catch (err) {
        console.error(`Failed to read ${key}:`, err?.message || err);
      }
    }),
  );

  return docs;
};

const loadDocs = async () => {
  const now = Date.now();

  if (cachedDocs && now - cachedAt < CACHE_TTL_MS) {
    return cachedDocs;
  }

  if (!loadingPromise) {
    loadingPromise = buildDocs()
      .then((docs) => {
        cachedDocs = docs;
        cachedAt = Date.now();
        return docs;
      })
      .finally(() => {
        loadingPromise = null;
      });
  }

  return loadingPromise;
};

const scoreChunk = ({ doc, keywords, phrases, question }) => {
  const normalizedQuestion = normalize(question);
  let score = 0;
  let matchedTerms = 0;

  for (const keyword of keywords) {
    const inText = doc.normalizedText.includes(keyword);
    const inHeading = doc.normalizedHeading.includes(keyword);
    const inKey = doc.normalizedKey.includes(keyword);

    if (inText) {
      score += 3;
      matchedTerms += 1;
    }

    if (inHeading) score += 5;
    if (inKey) score += 2;
  }

  for (const phrase of phrases) {
    if (phrase.length < 5) continue;

    if (doc.normalizedText.includes(phrase)) score += 7;
    if (doc.normalizedHeading.includes(phrase)) score += 8;
    if (doc.normalizedKey.includes(phrase)) score += 4;
  }

  if (
    normalizedQuestion.length >= 8 &&
    doc.normalizedText.includes(normalizedQuestion)
  ) {
    score += 15;
  }

  if (/^q:|^question:|^cau hoi:|^câu hỏi:/i.test(doc.text.trim())) {
    score += 2;
  }

  // Nếu câu hỏi có nhiều keyword mà chunk chỉ match 1 từ chung chung, giảm nhiễu.
  if (keywords.length >= 4 && matchedTerms <= 1) {
    score -= 4;
  }

  return Math.max(0, score);
};

export const handler = async (event) => {
  try {
    const method = event?.requestContext?.http?.method || event?.httpMethod;

    if (method === "OPTIONS") {
      return response(200, "");
    }

    if (!BUCKET) {
      return response(500, {
        message: "Missing DOCS_BUCKET environment variable",
      });
    }

    const body = getBody(event);
    const question = body.question || body.text || body.message;

    if (!question || !String(question).trim()) {
      return response(400, {
        message: "Missing question",
      });
    }

    const keywords = getKeywords(question);
    const phrases = getPhrases(question);
    const docs = await loadDocs();

    const scored = docs
      .map((doc) => ({
        key: doc.key,
        chunkIndex: doc.chunkIndex,
        heading: doc.heading,
        score: scoreChunk({ doc, keywords, phrases, question }),
        text: doc.text,
      }))
      .filter((item) => item.score >= MIN_SCORE)
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_CHUNKS_RETURN);

    const fallback =
      scored.length === 0 && ALLOW_FALLBACK
        ? docs.slice(0, Math.min(3, docs.length)).map((doc) => ({
            key: doc.key,
            chunkIndex: doc.chunkIndex,
            heading: doc.heading,
            score: 0,
            text: doc.text,
          }))
        : [];

    const topChunks = scored.length > 0 ? scored : fallback;

    const context = topChunks
      .map((item) =>
        [
          `SOURCE: ${item.key}`,
          `CHUNK: ${item.chunkIndex}`,
          item.heading ? `HEADING: ${item.heading}` : null,
          `SCORE: ${item.score}`,
          item.text,
        ]
          .filter(Boolean)
          .join("\n"),
      )
      .join("\n\n---\n\n");

    return response(200, {
      question,
      context,
      sources: [...new Set(topChunks.map((item) => item.key))],
      noMatch: topChunks.length === 0,
      message:
        topChunks.length === 0
          ? "No relevant document chunks found for this question."
          : undefined,
      debug: {
        bucket: BUCKET,
        prefixes: PREFIXES,
        keywords,
        phrases,
        totalChunksLoaded: docs.length,
        matchedChunks: scored.length,
        usedFallback: scored.length === 0 && fallback.length > 0,
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
