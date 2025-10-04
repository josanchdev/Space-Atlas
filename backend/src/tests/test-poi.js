require('dotenv').config();
const { explainPOI } = require('../services/ai-service');
const { downloadBlob } = require('../services/storage-service');
const fs = require('fs');

async function test() {
  // Simular datos del POI que vendrían de MongoDB
  const poiFromDB = {
    id: "1",
    lat: 39.8,
    lon: -139.4,
    title: "Erebus Montes",
    desc: "Formación volcánica en Marte",
    minZoom: 0.0,
    imagePath: "Mars_Express_spies_an_ancient_triple_crater_on_Mars_pillars.jpg", // Ruta en Azure
    
    path: "14/12_5"
  };

  console.log('🧪 Testing AI explanation for POI...\n');
  console.log('📍 POI Data from MongoDB:');
  console.log(JSON.stringify(poiFromDB, null, 2));
  console.log();

  // Descargar imagen desde Azure Blob Storage a resources/images
  const localImagePath = './resources/downloaded/downloaded_image.jpg';
  if (!fs.existsSync('./resources/downloaded')) {
	fs.mkdirSync('./resources/downloaded', { recursive: true });
  }

  await downloadBlob(`dzi/mars/out_dzi_files/${poiFromDB.path}.jpg`, localImagePath);

  console.log(`\n📷 Loading image from: ${localImagePath}\n`);
  
  const imageBuffer = fs.readFileSync(localImagePath);
  const base64Image = imageBuffer.toString('base64');
  const imageUrl = `data:image/jpeg;base64,${base64Image}`;

  // Pedir explicación a la IA con el título del POI y la imagen
  const explanation = await explainPOI(poiFromDB.title, imageUrl);
  
  console.log('📝 AI Explanation:\n');
  console.log(explanation);
  console.log('\n✅ Test completed successfully!');
  console.log('\n💡 Next steps: Integrate with MongoDB and frontend');
}

test().catch(console.error);
