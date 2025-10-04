require("dotenv").config()
const express = require("express")
const cors = require("cors")
const dbConnect = require("./config/mongo")

const app = express()

app.use(cors())
app.use(express.json({ limit: '50mb' })); // Para soportar imágenes en base64

const PORT = process.env.PORT || 3000

app.get("/status", (req, res) => {
  res.send("200 OK");
});


/**
 * Aqui invocamos a las rutas
 */

app.use("/api", require("./routes"))

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

dbConnect()