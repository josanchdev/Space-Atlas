require('dotenv').config();
const { explainFeature } = require('../services/ai-service');
const fs = require('fs');
const path = require('path');

async function test() {
  console.log('🧪 Probando GPT-4o Vision...\n');
  
  // Leer imagen local y convertir a base64
  const localImagePath = 'C:\\Users\\jsana\\Downloads\\Mars_Express_spies_an_ancient_triple_crater_on_Mars_pillars.jpg';
  const imageBuffer = fs.readFileSync(localImagePath);
  const base64Image = imageBuffer.toString('base64');
  const testImageUrl = `data:image/jpeg;base64,${base64Image}`;
  
  console.log('📷 Imagen cargada desde:', localImagePath);
  
  const explanation = await explainFeature(testImageUrl, 'Cráter de impacto');
  
  console.log('\n📝 Explicación:\n');
  console.log(explanation);
  console.log('\n✅ Prueba completada!');
}

test().catch(console.error);