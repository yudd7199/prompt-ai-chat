export default async function handler(req, res) {
  try {
    const { messages = [], lang = "en" } = req.body || {};

    const systemPrompt =
      lang === "zh"
        ? "你是Prompt专家，帮助用户优化提示词。"
        : "You are a prompt engineering expert helping improve prompts.";

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages
        ]
      })
    });

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      (lang === "zh" ? "暂无回复" : "No response");

    res.status(200).json({ reply });

  } catch (err) {
    res.status(500).json({
      reply: "Server error"
    });
  }
}