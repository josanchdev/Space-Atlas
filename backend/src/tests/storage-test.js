const { downloadBlob, uploadBlob, listBlobs, downloadFolder } = require('../services/storage-service');

async function test() {
  // Listar imágenes
  // const blobs = await listBlobs();
  // console.log('Blobs en el contenedor:', blobs);

  // Descargar una imagen dzi completa
  await downloadFolder('dzi/mars/', './resources/')

  // Subir una imagen
  // await uploadBlob('nueva_imagen.jpg', './ruta/a/tu/imagen.jpg');
}

test().catch(console.error);