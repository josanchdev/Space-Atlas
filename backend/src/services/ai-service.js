const { AzureOpenAI } = require('openai');
require('dotenv').config();

// Inicializar cliente Azure OpenAI
const client = new AzureOpenAI({
  endpoint: process.env.AZURE_OPENAI_ENDPOINT,
  apiKey: process.env.AZURE_OPENAI_KEY,
  apiVersion: process.env.AZURE_OPENAI_API_VERSION,
  deployment: process.env.AZURE_OPENAI_DEPLOYMENT
});

/**
 * Explica una característica espacial basada en tag manual e imagen
 */
async function explainFeature(imageUrl, tagName, coordinates = null) {
  try {
    let prompt = `You are an expert in astronomy and NASA space imagery.

                A feature called "${tagName}" has been identified in this space image.

                Provide an educational explanation in a maximum of 4 paragraphs about:
                1. What this feature is exactly
                2. How it was formed
                3. Why it is scientifically interesting
                4. A fun fact

                Respond clearly and accessibly in English.`;

    const response = await client.chat.completions.create({
      model: process.env.AZURE_OPENAI_DEPLOYMENT,
      messages: [
        {
          role: "system",
          content: "Eres un divulgador científico experto en astronomía."
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
      max_tokens: 600,
      temperature: 0.7
    });

    console.log(`Explicación generada para "${tagName}"`);
    return response.choices[0].message.content;

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

module.exports = { explainFeature };