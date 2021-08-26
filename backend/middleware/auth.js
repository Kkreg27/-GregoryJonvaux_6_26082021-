const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; //recupere le token dans le headers authorisation
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET"); //decode le token avec jwt avec pour 2eme argurment la clé de codage foruni dans la fonction login
    const userId = decodedToken.userId; //recupere l'user id de l'objet créer suite au decodage du token
    if (req.body.userId && req.body.userId !== userId) {
      //verifie si l'id fourni par la requete est celui fourni dans le token
      throw "ID utilisateur invalide"; //si non identique alors erreur
    } else {
      next(); //sinon on passe la suite des instructions a un autre middleware
    }
  } catch {
    res.status(401).json({
      error: new Error("requete non valide!"), //renvoi une erreur d'authentification
    });
  }
};
