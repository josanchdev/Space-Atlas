const express = require("express");
const router = express.Router();
const { downloadFolder } = require("../services/storage-service");
const fs = require("fs");
const path = require("path");

/**
 * GET /api/dzi/:id
 * Descarga toda la carpeta DZI desde Azure y la sirve estáticamente
 * La carpeta contiene:
 * - out_dzi.dzi (archivo descriptor)
 * - out_dzi_files/ (carpeta con todos los tiles)
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Ruta local donde se descargará la carpeta DZI
    const localDziFolder = path.join(__dirname, "../../resources/dzi", id);
    
    // Verificar si ya existe la carpeta descargada
    if (!fs.existsSync(localDziFolder)) {
      console.log(`Descargando carpeta DZI: dzi/${id}/`);
      
      // Descargar toda la carpeta desde Azure
      const azureFolder = `dzi/${id}/`;
      await downloadFolder(azureFolder, path.join(__dirname, "../../resources"));
      
      console.log(`Carpeta DZI descargada en: ${localDziFolder}`);
    } else {
      console.log(`Carpeta DZI ya existe localmente: ${localDziFolder}`);
    }
    
    // Servir la carpeta estáticamente usando express.static
    express.static(localDziFolder)(req, res, (err) => {
      if (err) {
        console.error("Error serving static files:", err);
        res.status(404).json({ 
          success: false,
          error: "DZI folder not found" 
        });
      }
    });
    
  } catch (error) {
    console.error("Error in DZI route:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

/**
 * Middleware para servir archivos estáticos DZI de forma directa
 * Esto permite que OpenSeadragon acceda a:
 * - /api/dzi/:id/out_dzi.dzi
 * - /api/dzi/:id/out_dzi_files/14/12_5.jpg
 */
router.use("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const localDziFolder = path.join(__dirname, "../../resources/dzi", id);
    
    // Si la carpeta no existe, descargarla primero
    if (!fs.existsSync(localDziFolder)) {
      console.log(`📥 Descargando carpeta DZI: dzi/${id}/`);
      const azureFolder = `dzi/${id}/`;
      await downloadFolder(azureFolder, path.join(__dirname, "../../resources"));
      console.log(`✅ Carpeta DZI descargada`);
    }
    
    // Servir archivos estáticos
    express.static(localDziFolder)(req, res, next);
    
  } catch (error) {
    console.error("Error serving DZI static files:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

module.exports = router;