import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json({ limit: "10mb" })); // aceita imagens grandes base64

app.post("/plant-identify", async (req, res) => {
  try {
    console.log("📸 Recebendo requisição de identificação...");

    const { images } = req.body;

    const identifyResponse = await axios.post(
      "https://api.plant.id/v2/identify",
      {
        images: images,
        modifiers: ["similar_images"],
        plant_details: [
          "common_names",
          "taxonomy",
          "url",
          "wiki_description",
          "edible_parts",
        ],
        plant_language: "pt",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Api-Key": process.env.PLANT_ID_API_KEY,
        },
      }
    );

    res.json(identifyResponse.data.suggestions || []);
  } catch (err) {
    console.error(
      "❌ Erro ao identificar planta:",
      err.response?.data || err.message
    );
    res.status(500).json({
      error: "Erro interno ao identificar planta",
      details: err.response?.data || err.message,
    });
  }
});

// ✅ Endpoint que chama o Mistral AI
app.post("/ask-mistral", async (req, res) => {
  try {
    const { data } = await axios.post(
      "https://api.mistral.ai/v1/chat/completions",
      req.body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MISTRAL_API_KEY}`,
        },
      }
    );

    res.json(data);
  } catch (err) {
    console.error(
      "❌ Erro ao consultar Mistral:",
      err.response?.data || err.message
    );
    res.status(500).json({
      error: "Erro interno ao consultar Mistral",
      details: err.response?.data || err.message,
    });
  }
});

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
