const blobServiceClient = require('../config/connection');
const fs = require('fs');
const path = require('path');

const containerName = process.env.AZURE_CONTAINER_NAME;

/**
 * Descarga una imagen específica de Azure Blob Storage y la guarda en resources/images
 * @param {string} blobPath - Ruta del blob en Azure (ej: 'datasets/image.jpg')
 * @returns {string} - Ruta local del archivo descargado
 */
async function downloadImageForPOI(blobPath) {
  try {
    // Crear directorio resources/images si no existe
    const resourcesDir = path.join(__dirname, '../../resources/images');
    if (!fs.existsSync(resourcesDir)) {
      fs.mkdirSync(resourcesDir, { recursive: true });
      console.log(`📁 Created directory: ${resourcesDir}`);
    }

    // Definir ruta local donde guardar la imagen
    const fileName = path.basename(blobPath);
    const localPath = path.join(resourcesDir, fileName);

    // Si ya existe, no descargar de nuevo
    if (fs.existsSync(localPath)) {
      console.log(`✅ Image already exists locally: ${localPath}`);
      return localPath;
    }

    // Descargar desde Azure
    console.log(`📥 Downloading from Azure: ${blobPath}`);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobPath);

    const downloadBlockBlobResponse = await blobClient.download(0);
    const writableStream = fs.createWriteStream(localPath);

    await new Promise((resolve, reject) => {
      downloadBlockBlobResponse.readableStreamBody.pipe(writableStream)
        .on("finish", resolve)
        .on("error", reject);
    });

    console.log(`✅ Image downloaded successfully: ${localPath}`);
    return localPath;

  } catch (error) {
    console.error('❌ Error downloading image:', error.message);
    throw error;
  }
}

module.exports = {
  downloadImageForPOI
};
