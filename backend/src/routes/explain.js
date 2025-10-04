const express = require("express")
const router = express.Router()
const { explainPOI } = require('../services/ai-service');
const { downloadBlob } = require("../services/storage-service")
const fs = require("fs")

/**
 * POST /api/explain
 */
router.post("/", async (req, res) => {
  try {
    const body = req.body
    
    // Descargar imagen desde Azure Blob Storage a resources/images
    const localImagePath = './resources/downloaded/downloaded_image.jpg';
    if (!fs.existsSync('./resources/downloaded')) {
      fs.mkdirSync('./resources/downloaded', { recursive: true });
    }

    await downloadBlob(`dzi/mars/out_dzi_files/${body.path}.jpg`, localImagePath);
    
    const imageBuffer = fs.readFileSync(localImagePath);
    const base64Image = imageBuffer.toString('base64');
    const imageUrl = `data:image/jpeg;base64,${base64Image}`;

    // Pedir explicación a la IA con el título del POI y la imagen
    const explanation = await explainPOI(body.title, imageUrl, body.description);

    res.json({
      success: true,
      response: explanation
    });

  } catch (error) {
    console.error('Error in /api/explain:', error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});


module.exports = router