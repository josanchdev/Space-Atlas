const { AzureOpenAI } = require('openai');
require('dotenv').config();

const client = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_KEY,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION,
  deployment: process.env.AZURE_OPENAI_DEPLOYMENT
});

async function explainPOI(poiTitle, imageUrl, description = '') {
  try {
    const prompt = `You are an expert in planetary science and Mars exploration.

Explain this Martian feature: "${poiTitle}" + ( ${description} )

Provide an educational explanation (maximum 4 paragraphs) about:
1. What exactly is "${poiTitle}" and what we see in the image
2. How this geological feature was formed
3. Why it is scientifically interesting
4. A fascinating fact

Respond clearly and accessibly in English.`;

    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT,
      messages: [
        {
          role: "system",
          content: "You are a planetary scientist specializing in Mars geology."
        },
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { 
              type: "image_url", 
              image_url: { 
                url: imageUrl,
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 700,
      temperature: 0.7
    });

    console.log(`✅ AI explanation generated for: ${poiTitle}`);
    return response.choices[0].message.content;

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

/**
 * Mantiene una conversación continua sobre un POI
 * @param {Array} conversationHistory - Historial de mensajes [{role: 'user'|'assistant', content: string}]
 * @param {string} userMessage - Nuevo mensaje del usuario
 * @param {string} imageUrl - URL de la imagen (opcional, solo para primer mensaje)
 * @param {string} poiContext - Contexto del POI (título y descripción)
 * @returns {string} - Respuesta del asistente
 */
async function chatWithPOI(conversationHistory, userMessage, imageUrl = null, poiContext = '') {
  try {
    const messages = [
      {
        role: "system",
        content: `You are a planetary scientist specializing in Mars geology. You are discussing ${poiContext}. Provide clear, educational, and engaging responses. Keep answers concise but informative.`
      }
    ];

    // Agregar historial de conversación
    conversationHistory.forEach(msg => {
      messages.push({
        role: msg.role,
        content: msg.content
      });
    });

    // Agregar nuevo mensaje del usuario
    if (imageUrl) {
      // Si hay imagen, incluirla (primer mensaje)
      messages.push({
        role: "user",
        content: [
          { type: "text", text: userMessage },
          { 
            type: "image_url", 
            image_url: { 
              url: imageUrl,
              detail: "high"
            }
          }
        ]
      });
    } else {
      // Mensaje de texto simple
      messages.push({
        role: "user",
        content: userMessage
      });
    }

    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT,
      messages: messages,
      max_tokens: 500,
      temperature: 0.7
    });

    console.log(`✅ Chat response generated`);
    return response.choices[0].message.content;

  } catch (error) {
    console.error('❌ Error in chat:', error.message);
    throw error;
  }
}

module.exports = { explainPOI, chatWithPOI };
