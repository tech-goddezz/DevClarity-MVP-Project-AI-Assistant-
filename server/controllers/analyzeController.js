import { groq } from "../config/groq.js";

// Used when the model returns garbage or we can't parse JSON — UI still gets a full object.
const safeDefaultAnalysis = {
  score: 0,
  summary:
    "We could not read the AI reply in the expected format. The model still ran—try Analyze again, or paste a shorter code sample.",
  issues: ["The AI reply was not valid structured data."],
  suggestions: [
    "Click Analyze again.",
    "If this repeats, shorten the pasted code.",
  ],
};

function removeCodeBlockWrapper(text) {
  return String(text ?? "").replace(/```json\s*|```/gi, "").trim();
}

// Model often adds text around the JSON; this grabs the first {...} without breaking strings.
function findFirstJsonObject(str) {
  const s = String(str ?? "");
  const start = s.indexOf("{");
  if (start === -1) return null;

  let depth = 0;
  let inString = false;
  let escape = false;

  for (let i = start; i < s.length; i++) {
    const c = s[i];

    if (escape) {
      escape = false;
      continue;
    }
    if (inString) {
      if (c === "\\") {
        escape = true;
        continue;
      }
      if (c === '"') {
        inString = false;
      }
      continue;
    }

    if (c === '"') {
      inString = true;
      continue;
    }

    if (c === "{") depth++;
    if (c === "}") {
      depth--;
      if (depth === 0) return s.slice(start, i + 1);
    }
  }

  return null;
}

function parseJsonFromModel(rawText) {
  const cleaned = removeCodeBlockWrapper(rawText);

  const tries = [
    () => JSON.parse(cleaned),
    () => {
      const chunk = findFirstJsonObject(cleaned);
      return chunk ? JSON.parse(chunk) : null;
    },
  ];

  for (const attempt of tries) {
    try {
      const obj = attempt();
      if (obj !== null && typeof obj === "object" && !Array.isArray(obj)) {
        return obj;
      }
    } catch {
      // next try
    }
  }

  return null;
}

function fixScore(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return Math.min(10, Math.max(0, Math.round(n)));
}

  function asStrings(value) {
    
  if (Array.isArray(value)) {
    return value.map((x) => String(x).trim()).filter(Boolean);
  }
  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }
  return [];
}

function cleanList(items, maxItems = 5) {
  const seen = new Set();
  const cleaned = [];

  for (const item of items) {
    const text = String(item).trim();
    if (!text) continue;
    if (text.length < 8) continue;

    const key = text.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    cleaned.push(text);

    if (cleaned.length >= maxItems) break;
  }

  return cleaned;
}

function buildAnalysis(raw) {
  let summary =
    raw.summary !== undefined && raw.summary !== null
      ? String(raw.summary).trim()
      : "";

  const junkChars = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(
    summary
  );
  if (!summary || summary.length < 2 || junkChars) {
    summary = "AI could not generate a proper summary.";
  }

  const issues = cleanList(asStrings(raw.issues), 5);

  let suggestions = cleanList(asStrings(raw.suggestions), 5);
  if (suggestions.length === 0) {
    suggestions = ["Add input validation and clearer error handling."];
  }

    let score = fixScore(raw.score);

    // Keep score realistic based on issue count
    if (issues.length >= 4 && score > 7) {
      score = 7;
    }

    if (issues.length === 0 && score < 7) {
      score = 7;
    }

    return {
      score,
      summary,
      issues,
      suggestions,
    };
}

export const analyzeCode = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        status: "error",
        message: "No code provided",
      });
    }

    const prompt = `
You are reviewing one code snippet for a beginner developer.

Return ONLY valid JSON.

REQUIRED JSON SHAPE:
{
  "score": number, // integer 0 to 10
  "summary": string, // one short sentence
  "issues": string[], // 0 to 5 items, each clear and specific
  "suggestions": string[] // 1 to 5 items, each actionable
}

SCORING GUIDE:
- 9-10: clean and production-ready
- 7-8: mostly good, minor fixes needed
- 4-6: mixed quality, important issues exist
- 0-3: major issues or unsafe patterns

RULES:
- No markdown
- No extra keys outside score, summary, issues, suggestions
- Keep summary plain English and easy to read
- Avoid generic advice (be specific to the provided code)
- If no issues, return an empty issues array
- If no suggestions, still return at least one small improvement suggestion

IF YOU CANNOT COMPLY, RETURN:
{
  "score": 0,
  "summary": "Unable to analyze code properly",
  "issues": [],
  "suggestions": ["Try again with a shorter code sample."]
}

CODE:
${code}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content: `
              You are a strict JSON API.
              Output must be valid JSON only.
              No markdown. No prose outside JSON.
              Use only these keys: score, summary, issues, suggestions.
              Keep wording simple for beginners.
                    `,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const reply = completion.choices[0]?.message?.content;

    if (reply == null || reply === "") {
      console.error("Groq returned empty content");
      const analysis = {
        ...safeDefaultAnalysis,
        summary:
          "The AI returned an empty reply. Try again in a moment or shorten your code.",
      };
      return res.json({
        status: "success",
        ...analysis,
      });
    }

    const modelJson = parseJsonFromModel(reply);

    let analysis;

    if (!modelJson) {
      console.error("Could not parse AI response as JSON. RAW:", reply);
      analysis = { ...safeDefaultAnalysis };
    } else {
      analysis = buildAnalysis(modelJson);
    }

    res.json({
      status: "success",
      ...analysis,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "AI analysis failed",
    });
  }
};
