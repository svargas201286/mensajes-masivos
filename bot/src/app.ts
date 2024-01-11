import "dotenv/config";
import express from "express";
import cors from "cors";
import https from "https";
import fs from "fs";
import path from "path"; // Agrega el módulo 'path' para manejar rutas

import routes from "./infrastructure/router";

const port = process.env.PORT || 7132;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('tmp'));
app.use("/", routes);

app.get("/", (req, res) => {
  res.send("API funcionando en 7132");
});

// Obtén la ruta completa de los archivos crt y private.key
const privateKeyPath = path.resolve(__dirname, "../private.key");
const certificatePath = path.resolve(__dirname, "../certificate.crt");

// Configurar el servidor HTTPS
const options = {
  key: fs.readFileSync(privateKeyPath),
  cert: fs.readFileSync(certificatePath),
};

const server = https.createServer(options, app);

server.listen(port, () => console.log(`Ready...${port}`));
