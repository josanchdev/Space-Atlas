const mongoose = require("mongoose")
const { v4: uuidv4 } = require("uuid")  // instala con: npm install uuid

const PoiModel = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4, // genera un UUID automático
      unique: true
    },
    lat: {
      type: Number,
      required: true
    },
    lon: {
      type: Number,
      required: true
    },
    title: {
      type: String
    },
    description: {
      type: String
    },
    path: {
      type: String // "[num]/[num]_[num]"
    },
    origin: {
      type: String,
      default: ""
    }
  },
  {
    versionKey: false
  }
)

module.exports = mongoose.model("pois", PoiModel)