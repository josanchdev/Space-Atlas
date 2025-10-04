require('dotenv').config();
const { explainFeature } = require('../services/ai-service');

async function test() {
  console.log('🧪 Probando GPT-4o Vision...\n');
  
  // URL de ejemplo (puedes usar una imagen de tu Azure Blob)
  const testImageUrl = 'https://www.esa.int/var/esa/storage/images/esa_multimedia/images/2020/10/mars_express_spies_an_ancient_triple_crater_on_mars/22287252-1-eng-GB/Mars_Express_spies_an_ancient_triple_crater_on_Mars_pillars.jpg';
  
  const explanation = await explainFeature(testImageUrl, 'Cráter de impacto');
  
  console.log('\n📝 Explicación:\n');
  console.log(explanation);
  console.log('\n✅ Prueba completada!');
}

test().catch(console.error);