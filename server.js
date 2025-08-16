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

    const apiRes = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-r1",
        messages: [
          { 
            role: "system", 
            content: "Your name is MaganaAI. You were created by Ahmad Garba Adamu, a young Nigerian entrepreneur from Kano. You are a friendly assistant that responds in Hausa. Your responses must align with Hausa traditions, religion, culture and values. (Kai mai taimako ne mai magana da Hausa. Amsa cikin Hausa kuma ka kiyaye al'adu, addini da dabi'un Hausawa.)" 
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    const data = await apiRes.json();
    if (!apiRes.ok) {
      return res.status(apiRes.status).json({ 
        error: "DeepSeek API error", 
        details: data 
      });
    }

    const reply = data.choices?.[0]?.message?.content || "";
    return res.json({ reply });
  } catch (err) {
    console.error("DeepSeek Error:", err);
    return res.status(500).json({ 
      error: "Internal server error", 
      details: String(err) 
    });
  }
});
    
