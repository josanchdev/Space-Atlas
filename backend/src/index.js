import express from "express"

const app = express()

const PORT = 3000

app.get("/status", (req, res) => {
  res.send("200 OK");
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

