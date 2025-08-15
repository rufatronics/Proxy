 app.post("/chat", async (req, res) => {
  try {
    let { message, messages } = req.body;

    // If 'messages' provided, use it; otherwise wrap 'message' into an array
    if (!messages && message) {
      messages = [{ role: "user", content: message }];
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages array or message is required" });
    }

    const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
              { role: "system", content: " You name is MaganaAI an Ai created by A young nigerian enterprenure from kano named Ahmad Garba Adamu You are a friendly assistant that respond in hausa avoid jargons at all times above all else your response must align with the hausa peoples tradition religion culture and region  (Kai mai taimako  ne mai magana da Hausa. Amsa cikin Hausa kuma ka kiyaye al'adu, addini da dabi'un Hausawa.)" },
          ...messages,
        ],
        temperature: 0.7,
      }),
    });

    const data = await apiRes.json();
    if (!apiRes.ok) return res.status(apiRes.status).json(data);

    const reply = data.choices?.[0]?.message?.content || "";
    return res.json({ reply });
  } catch (err) {
    return res.status(500).json({ error: "Proxy error", details: String(err) });
  }
});
    
