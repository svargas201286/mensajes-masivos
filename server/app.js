const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();
const port = 9292;

const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "whatsapp_post_auto",
});

db.connect((err) => {
  if (err) {
    console.error("Error al conectar a la base de datos: " + err.message);
  } else {
    console.log("Conexión exitosa a la base de datos");
  }
});

const corsOptions = {
  origin: "http://localhost:9191", // Reemplaza con el dominio de tu frontend
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(express.json());
app.use(cors(corsOptions));

app.post("/register", async (req, res) => {
  const { nombre, mail, contraseña } = req.body;

  // Verificar si el correo ya está registrado
  const checkEmailQuery = "SELECT * FROM users WHERE mail = ?";
  db.query(checkEmailQuery, [mail], async (err, results) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Error al verificar el correo en la base de datos" });
    } else if (results.length > 0) {
      res
        .status(400)
        .json({
          error: "El correo ya está registrado. Por favor, elija otro correo.",
        });
    } else {
      // Encriptar la contraseña antes de almacenarla
      const hashedPassword = await bcrypt.hash(contraseña, 10);

      // Insertar el usuario en la base de datos
      const insertUserQuery =
        "INSERT INTO users (nombre, mail, contraseña) VALUES (?, ?, ?)";
      db.query(
        insertUserQuery,
        [nombre, mail, hashedPassword],
        (err, result) => {
          if (err) {
            res
              .status(500)
              .json({
                error: "Error al registrar el usuario en la base de datos",
              });
          } else {
            res
              .status(201)
              .json({ message: "Usuario registrado exitosamente" });
          }
        }
      );
    }
  });
});

app.post("/login", async (req, res) => {
  const { mail, contraseña } = req.body;

  // Verificar si el correo existe en la base de datos
  const getUserQuery = "SELECT * FROM users WHERE mail = ?";
  db.query(getUserQuery, [mail], async (err, results) => {
    if (err) {
      res
        .status(500)
        .json({ error: "Error al verificar el correo en la base de datos" });
    } else if (results.length === 0) {
      res
        .status(401)
        .json({
          error:
            "Credenciales inválidas. Revise bien el correo y la contraseña.",
        });
    } else {
      // Verificar la contraseña
      const user = results[0];
      const passwordMatch = await bcrypt.compare(contraseña, user.contraseña);

      if (passwordMatch) {
        res.status(200).json({ message: "Inicio de sesión exitoso" });
      } else {
        res
          .status(401)
          .json({
            error:
              "Credenciales inválidas. Revise bien el correo y la contraseña.",
          });
      }
    }
  });
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
  });
  