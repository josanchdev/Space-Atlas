require('dotenv').config();
const { downloadImageForPOI } = require('../services/download-service');
const fs = require('fs');

// Simular peticiones HTTP al endpoint
async function testEndpoint() {
  console.log('🧪 Testing POI Chat Endpoint (simulated)...\n');
  console.log('📝 This test simulates HTTP POST requests to /api/poi/chat\n');

  // Preparar datos
  const poiFromDB = {
    title: "Erebus Montes",
    description: "Formación volcánica en Marte",
    imagePath: "Mars_Express_spies_an_ancient_triple_crater_on_Mars_pillars.jpg"
  };

  // Descargar imagen
  const localImagePath = await downloadImageForPOI(poiFromDB.imagePath);
  const imageBuffer = fs.readFileSync(localImagePath);
  const base64Image = imageBuffer.toString('base64');
  const imageUrl = `data:image/jpeg;base64,${base64Image}`;

  let conversationHistory = [];

  // ========== REQUEST 1: Primer mensaje con imagen ==========
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📤 REQUEST 1: POST /api/poi/chat');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const request1 = {
    poiTitle: poiFromDB.title,
    poiDescription: poiFromDB.description,
    imageUrl: imageUrl,
    conversationHistory: [],
    userMessage: "Tell me about this Martian feature"
  };

  console.log('Body:', JSON.stringify({
    ...request1,
    imageUrl: '[base64 image data...]' // No mostrar todo el base64
  }, null, 2));
  console.log();

  // Importar la función del servicio
  const { chatWithPOI } = require('../services/ai-service');
  
  const response1 = await chatWithPOI(
    request1.conversationHistory,
    request1.userMessage,
    request1.imageUrl,
    `${request1.poiTitle}: ${request1.poiDescription}`
  );

  console.log('📥 RESPONSE 1:');
  console.log(JSON.stringify({
    success: true,
    response: response1,
    conversationHistoryLength: 2
  }, null, 2));
  console.log();

  // Actualizar historial
  conversationHistory = [
    { role: 'user', content: request1.userMessage },
    { role: 'assistant', content: response1 }
  ];

  // ========== REQUEST 2: Pregunta de seguimiento ==========
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📤 REQUEST 2: POST /api/poi/chat');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const request2 = {
    poiTitle: poiFromDB.title,
    poiDescription: poiFromDB.description,
    imageUrl: null, // Sin imagen en mensajes subsecuentes
    conversationHistory: conversationHistory,
    userMessage: "How was it formed?"
  };

  console.log('Body:', JSON.stringify(request2, null, 2));
  console.log();

  const response2 = await chatWithPOI(
    request2.conversationHistory,
    request2.userMessage,
    request2.imageUrl,
    `${request2.poiTitle}: ${request2.poiDescription}`
  );

  console.log('📥 RESPONSE 2:');
  console.log(JSON.stringify({
    success: true,
    response: response2,
    conversationHistoryLength: 4
  }, null, 2));
  console.log();

  // Actualizar historial
  conversationHistory.push({ role: 'user', content: request2.userMessage });
  conversationHistory.push({ role: 'assistant', content: response2 });

  // ========== REQUEST 3: Última pregunta ==========
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📤 REQUEST 3: POST /api/poi/chat');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  const request3 = {
    poiTitle: poiFromDB.title,
    poiDescription: poiFromDB.description,
    imageUrl: null,
    conversationHistory: conversationHistory,
    userMessage: "Is there evidence of water in this area?"
  };

  console.log('Body:', JSON.stringify(request3, null, 2));
  console.log();

  const response3 = await chatWithPOI(
    request3.conversationHistory,
    request3.userMessage,
    request3.imageUrl,
    `${request3.poiTitle}: ${request3.poiDescription}`
  );

  console.log('📥 RESPONSE 3:');
  console.log(JSON.stringify({
    success: true,
    response: response3,
    conversationHistoryLength: 6
  }, null, 2));
  console.log();

  // ========== RESUMEN ==========
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Endpoint test completed successfully!');
  console.log(`📊 Total requests: 3`);
  console.log(`💬 Final conversation length: ${conversationHistory.length + 2} messages`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('💡 To test the real HTTP endpoint:');
  console.log('1. Start server: npm run dev');
  console.log('2. Use Postman or curl to POST to http://localhost:3000/api/poi/chat');
  console.log('3. Send JSON body with: poiTitle, userMessage, conversationHistory, imageUrl (optional)');
}

testEndpoint().catch(console.error);
