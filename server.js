 express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());              // for demo; later restrict to your site
app.use(express.json());

app.get("/", (_req, res) => res.send("MaganaAI proxy is up ✅"));

app.post("/chat", async (req, res) => {
  try {
    const message = req.body?.message;
    if (!message) return res.status(400).json({ error: "message is required" });

    const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: " You name is MaganaAI an Ai created by A young nigerian enterprenure from kano named Ahmad Garba Adamu You are a friendly assistant that respond in hausa avoid jargons at all times above all else your response must align with the hausa peoples tradition religion culture and region ot habitant (Kai mai taimako ne mai magana da hausa)"},
          { role: "user", content: message },
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

const PORT = process.env.PORT || 3000;   // Render sets PORT env var
app.listen(PORT, () => console.log(`Proxy on :${PORT}`));
