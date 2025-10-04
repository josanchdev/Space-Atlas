require('dotenv').config();
const { chatWithPOI } = require('../services/ai-service');
const { downloadImageForPOI } = require('../services/download-service');
const fs = require('fs');

async function test() {
  console.log('🧪 Testing POI Chat Conversation...\n');

  // Simular datos del POI que vendrían de MongoDB
  const poiFromDB = {
    id: "1",
    lat: 39.8,
    lon: -139.4,
    title: "Erebus Montes",
    desc: "Formación volcánica en Marte",
    minZoom: 0.0,
    imagePath: "Mars_Express_spies_an_ancient_triple_crater_on_Mars_pillars.jpg",
    dzi: {
      path: "out_dzi_files/1/1.dzi",
      tiles: "out_dzi_files/1/{level}/{col}_{row}.jpg"
    }
  };

  console.log('📍 POI Data from MongoDB:');
  console.log(JSON.stringify(poiFromDB, null, 2));
  console.log();

  // Descargar imagen desde Azure
  const localImagePath = await downloadImageForPOI(poiFromDB.imagePath);
  const imageBuffer = fs.readFileSync(localImagePath);
  const base64Image = imageBuffer.toString('base64');
  const imageUrl = `data:image/jpeg;base64,${base64Image}`;

  const poiContext = `${poiFromDB.title}: ${poiFromDB.desc}`;
  let conversationHistory = [];

  // ========== PRIMER MENSAJE: Explicación inicial con imagen ==========
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👤 USER: Tell me about this Martian feature');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const firstMessage = `Tell me about ${poiFromDB.title}. What can you see in this image?`;
  
  const response1 = await chatWithPOI(
    conversationHistory,
    firstMessage,
    imageUrl, // Se envía la imagen solo en el primer mensaje
    poiContext
  );

  console.log('🤖 ASSISTANT:');
  console.log(response1);
  console.log();

  // Actualizar historial
  conversationHistory.push({ role: 'user', content: firstMessage });
  conversationHistory.push({ role: 'assistant', content: response1 });

  // ========== SEGUNDO MENSAJE: Pregunta de seguimiento ==========
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👤 USER: How old is this formation?');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const secondMessage = "How old is this formation?";
  
  const response2 = await chatWithPOI(
    conversationHistory,
    secondMessage,
    null, // No se envía imagen en mensajes subsecuentes
    poiContext
  );

  console.log('🤖 ASSISTANT:');
  console.log(response2);
  console.log();

  // Actualizar historial
  conversationHistory.push({ role: 'user', content: secondMessage });
  conversationHistory.push({ role: 'assistant', content: response2 });

  // ========== TERCER MENSAJE: Otra pregunta ==========
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('👤 USER: Could humans explore this area?');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const thirdMessage = "Could humans explore this area in the future?";
  
  const response3 = await chatWithPOI(
    conversationHistory,
    thirdMessage,
    null,
    poiContext
  );

  console.log('🤖 ASSISTANT:');
  console.log(response3);
  console.log();

  // ========== RESUMEN FINAL ==========
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Test completed successfully!');
  console.log(`📊 Total messages in conversation: ${conversationHistory.length}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('💡 Conversation History:');
  conversationHistory.forEach((msg, idx) => {
    const emoji = msg.role === 'user' ? '👤' : '🤖';
    console.log(`${idx + 1}. ${emoji} ${msg.role.toUpperCase()}: ${msg.content.substring(0, 60)}...`);
  });
}

test().catch(console.error);
