import OpenAI from "openai";

export const analyzeCode = async (req, res) => {
  try {
    const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

  
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        status: "error",
        message: "No code provided",
      });
    }

    const prompt = `
You are a senior software engineer.

Analyze the following code and return:

1. Score (0-10)
2. Short summary
3. Issues (array)
4. Suggestions (array)

Respond ONLY in JSON format like this:

{
  "score": number,
  "summary": "...",
  "issues": ["..."],
  "suggestions": ["..."]
}

Code:
${code}
`;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const aiText = response.output_text;

    let parsed;

    try {
      parsed = JSON.parse(aiText);
    } catch {
      return res.status(500).json({
        status: "error",
        message: "AI returned invalid JSON",
      });
    }

    res.json({
      status: "success",
      ...parsed,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "error",
      message: "AI analysis failed",
    });
  }
};