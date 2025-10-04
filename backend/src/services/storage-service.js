const blobServiceClient = require('../config/connection');
const fs = require('fs');
const path = require('path');

const containerName = process.env.AZURE_CONTAINER_NAME;

// Función para descargar una imagen
async function downloadBlob(blobName, downloadPath) {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlobClient(blobName);

    const downloadBlockBlobResponse = await blobClient.download(0);
    const writableStream = fs.createWriteStream(downloadPath);

    await new Promise((resolve, reject) => {
      downloadBlockBlobResponse.readableStreamBody.pipe(writableStream)
        .on("finish", resolve)
        .on("error", reject);
    });

    console.log(`Imagen ${blobName} descargada en ${downloadPath}`);
    return downloadPath;
  } catch (error) {
    console.error('Error descargando blob:', error.message);
    throw error;
  }
}

// Función para subir una imagen
async function uploadBlob(blobName, filePath) {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadFile(filePath);
    console.log(`Imagen ${blobName} subida correctamente`);
    return blockBlobClient.url;
  } catch (error) {
    console.error('Error subiendo blob:', error.message);
    throw error;
  }
}

// Función para listar todas las imágenes en el contenedor
async function listBlobs() {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobs = [];
    
    for await (const blob of containerClient.listBlobsFlat()) {
      blobs.push(blob.name);
    }
    
    console.log(`Total de blobs encontrados: ${blobs.length}`);
    return blobs;
  } catch (error) {
    console.error('Error listando blobs:', error.message);
    throw error;
  }
}

// Función para descargar una carpeta completa (recursiva)
async function downloadFolder(folderPrefix, localFolder) {
  try {
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobs = [];

    // Listar todos los blobs con el prefijo de la carpeta
    for await (const blob of containerClient.listBlobsFlat({ prefix: folderPrefix })) {
      blobs.push(blob.name);
    }

    console.log(`Encontrados ${blobs.length} archivos en ${folderPrefix}`);

    // Descargar cada blob manteniendo estructura
    for (const blobName of blobs) {
      const blobClient = containerClient.getBlobClient(blobName);
      
      // Crear ruta local manteniendo estructura
      const localPath = path.join(localFolder, blobName);
      const localDir = path.dirname(localPath);

      // Crear directorio si no existe
      if (!fs.existsSync(localDir)) {
        fs.mkdirSync(localDir, { recursive: true });
      }

      // Descargar archivo
      const downloadResponse = await blobClient.download(0);
      const writableStream = fs.createWriteStream(localPath);

      await new Promise((resolve, reject) => {
        downloadResponse.readableStreamBody.pipe(writableStream)
          .on("finish", () => {
            resolve();
          })
          .on("error", reject);
      });
    }

    console.log(`Descarga completa de ${folderPrefix} en ${localFolder}`);
    return blobs;
  } catch (error) {
    console.error('Error descargando carpeta:', error.message);
    throw error;
  }
}

module.exports = {
  downloadBlob,
  uploadBlob,
  listBlobs,
  downloadFolder
};