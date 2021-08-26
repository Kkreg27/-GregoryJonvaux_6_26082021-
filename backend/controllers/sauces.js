const Sauce = require("../models/Sauces");
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce); //extrai le json depuis l'objet sauce
  delete sauceObject._id; //Supprime l'id de l'objet de la requete car MOngo DB en génre deja un
  const sauce = new Sauce({
    ...sauceObject, //liste les champs de la requete du body en details (id ,name, etc..)
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename //creation de l'url de l'image
    }`,
  });
  sauce
    .save() //Enregistre la sauce dans la base de donnée
    .then(() => res.status(201).json({ message: "Sauce enregistré !" })) //renvoi une reponse au front pour pas expiré la requete
    .catch((error) => res.status(400).json({ error })); //Capture l'erreur
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    //recupere la donnée depuis la méthode findOne
    _id: req.params.id, //Objet en vente correspond à l'identifiant mis dans le parametre d'url
  })
    .then((sauce) => {
      res.status(200).json(sauce); //renvoi la donnée dans la reponse du front
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      }); //Récupere et renvoi l'erreur
    });
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  if (sauceObject.imageUrl) {
    Sauce.findOne({ _id: req.params.id }) //
      .then((sauce) => {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {});
      })
      .catch((error) => res.status(500).json({ error }));
  }
  Sauce.updateOne(
    { _id: req.params.id }, //filtre
    { ...sauceObject, _id: req.params.id } //update
  )
    .then(() => res.status(200).json({ message: "Sauce modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) //recupere l'objet pour obtenir l'url de l'image afin de la supprimer
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1]; //recupere le nom du fichier
      fs.unlink(`images/${filename}`, () => {
        //unlink permet de supprimer un fichier
        Sauce.deleteOne(
          //utilise la methode deleteOne
          { _id: req.params.id } //objet de comparaison
        )
          .then(() => res.status(200).json({ message: "Sauce supprimé !" })) //renvoi ces données dans la reponse du front
          .catch((error) => res.status(400).json({ error })); //Récupere et renvoi l'erreur
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
  Sauce.find() //recupere les données de sauce depuis la méthode find
    .then((sauces) => {
      res.status(200).json(sauces); //renvoi ces données dans la reponse du front
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      }); //Récupere et renvoi l'erreur
    });
};

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const like = req.body.like;
      const ID = req.body.userId; //mon id d'utilisateur
      const test = req.params.id; //id du produit
      console.log(`id produit : ${JSON.stringify(test)}`); //idproduit
      console.log(`id utilisateur connecté : ${ID}`); //userid

      if (like == 1) {
        //requete j'aime = 1
        if (sauce.usersLiked == 0 && sauce.usersDisliked == 0) {
          // tableau userliked et unserdisliked sont vide
          sauce.likes++; //ajoute +1 au likes
          sauce.usersLiked.push(sauce.userId); //ajoute l'userId dans le tableau de usersliked
          console.log(sauce);
          Sauce.updateOne(
            //Sauce =  modèle de sauce
            //
            { _id: req.params.id }, //filtre
            { _id: req.params.id } //nouvelle modifcation mis a jour
          )
            .then(() => res.status(200).json({ message: "Like mis a jour !" })) //envoi de réponse au frontend
            .catch((error) => res.status(400).json({ error })); // recupere et renvoi l'erreur'
          console.log("Vous venez d'aimer la sauce");
        } else {
        }
      } else {
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
