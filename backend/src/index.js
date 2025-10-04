require("dotenv").config()
const express = require("express")
const cors = require("cors")
const dbConnect = require("./config/mongo")

const app = express()

app.use(cors())
app.use(express.json({ limit: '50mb' })); // Para soportar imágenes en base64

const PORT = process.env.PORT || 3000

app.get("/status", (req, res) => {
  res.send("200 OK");
});


/**
 * Aqui invocamos a las rutas
 */

app.use("/api", require("./routes"))


/**
 * POST /api/poi/chat
 * Body: {
 *   poiTitle: string,
 *   poiDescription: string,
 *   imageUrl: string (opcional, base64 o URL),
 *   conversationHistory: [{role: 'user'|'assistant', content: string}],
 *   userMessage: string
 * }
 */
app.post("/api/poi/chat", async (req, res) => {
  try {
    const { chatWithPOI } = require('./services/ai-service');
    
    const { 
      poiTitle, 
      poiDescription = '',
      imageUrl = null,
      conversationHistory = [],
      userMessage 
    } = req.body;

    if (!poiTitle || !userMessage) {
      return res.status(400).json({ 
        error: 'poiTitle and userMessage are required' 
      });
    }

    const poiContext = `${poiTitle}${poiDescription ? ': ' + poiDescription : ''}`;
    
    const response = await chatWithPOI(
      conversationHistory,
      userMessage,
      imageUrl,
      poiContext
    );

    res.json({
      success: true,
      response: response,
      conversationHistory: [
        ...conversationHistory,
        { role: 'user', content: userMessage },
        { role: 'assistant', content: response }
      ]
    });

  } catch (error) {
    console.error('Error in /api/poi/chat:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

dbConnect()