const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const saucesRoutes = require("./routes/saucePath");
const userRoutes = require("./routes/user");
const app = express();
require("dotenv").config();
//
//
const MGDBUser = process.env.JS_USER;
const MGDBPassword = process.env.JS_PASSWORD;
//
//--------Liaison avec la baase donnée MONGODB--------------------------------------------------------
mongoose
  .connect(
    `mongodb+srv://${MGDBUser}:${MGDBPassword}@cluster0.7l452.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));
//
//
app.use(helmet());
//
//-------Middleware génrérale qui ajoute des headers au réponse pour les autorisation de CORS------------------------
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//
//
//
//----------Transforme le corps de la requete en Objet JavaScript-----------------------------------------
app.use(bodyParser.json());

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/sauces", saucesRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
