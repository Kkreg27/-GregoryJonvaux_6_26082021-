const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const sanitize = require("mongo-sanitize");
const User = require("../models/User");

exports.signup = (req, res, next) => {
  if (
    validator.isEmail(req.body.email) &&
    validator.isStrongPassword(req.body.password)
  ) {
    bcrypt
      .hash(sanitize(req.body.password), 10) // Hashage 10 fois du mot de passe du corps de la requete
      .then((hash) => {
        //hashage envoyé dans un nouvel utilisateur
        const user = new User({
          //model fourni depuis mongoose
          email: req.body.email,
          password: hash, // enregistre le hash créé
        });
        user
          .save() //enregistre l'utilisateur dans la base de données
          .then(() => res.status(201).json({ message: "Utilisateur créé !" })) //renvoi ces données dans la reponse du front
          .catch((error) => res.status(400).json({ error })); // recupere et renvoi l'erreur
      })
      .catch((error) => res.status(500).json({ error })); // recupere et renvoi l'erreur
  }
};

exports.login = (req, res, next) => {
  User.findOne({ email: sanitize(req.body.email) }) //permet de trouver l'utilisateur de la base de donnée depuis l'email de la requete
    .then((user) => {
      if (!user) {
        //si l'user n'existe pas alors on renvoi une erreur non autorisé
        return res.status(401).json({ error: "Utilisateur non trouvé !" });
      }
      bcrypt //utilise bcrypt pour comparer le mot de passe de la requete avec le hash de l'user trouvé
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            //si mot de passe non valable alors 401 pour erreur
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            //sinon renvoi un objet json
            userId: user._id, //renvoi l'utilisateur dasn la base de donnée
            token: jwt.sign(
              //utilise la fonction sign de jsonwebtoken
              { userId: user._id }, //1er argument payload qui permet au passage de verifier que la requete correspond au meme id
              "RANDOM_TOKEN_SECRET", //2eme argument clé secrete pour l'encodage
              {
                expiresIn: "24h", //3eme argument , permet d'expirer le token au bout d'un lapse de temps
              }
            ), //renvoi un token crypté
          });
        })
        .catch((error) => res.status(500).json({ error })); //recupere et renvoi l'erreur'
    })
    .catch((error) => res.status(500).json({ error })); //recupere et renvoi l'erreur'
};
