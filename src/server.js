import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());

// ✅ Endpoint que chama o Plant.id
app.post("/plant-identify", async (req, res) => {
  try {
    const response = await fetch("https://api.plant.id/v3/identification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": process.env.PLANTID_API_KEY,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data); // ✅ envia a resposta
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// ✅ Endpoint que chama o Mistral AI
app.post("/ask-mistral", async (req, res) => {
  try {
    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data); // ✅ envia a resposta
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// ✅ Endpoint de teste simples
app.get("/hello", (req, res) => {
  try {
    const data = { message: "Olá mundo" }; // cria o objeto de resposta
    res.json(data); // envia a resposta
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

app.listen(3000, () => console.log("✅ Servidor rodando na porta 3000"));
