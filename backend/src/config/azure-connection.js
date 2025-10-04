require('dotenv').config();
const { BlobServiceClient } = require('@azure/storage-blob');

// Cargar variables de entorno
const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;

if (!connectionString) {
  throw new Error('AZURE_STORAGE_CONNECTION_STRING no está definida en .env');
}

// Crear cliente de Blob Storage
const blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);

module.exports = blobServiceClient;