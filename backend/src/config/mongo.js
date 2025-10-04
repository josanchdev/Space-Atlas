const mongoose = require("mongoose")

const dbConnect = async () => {
  try {
    const DB_URI = process.env.MONGO_DB_URI
    await mongoose.connect(DB_URI) // sin opciones extra
    console.log("Conectado a MongoDB")
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error)
  }
}

module.exports = dbConnect
