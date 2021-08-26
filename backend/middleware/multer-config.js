const multer = require("multer");

const MIME_TYPES =
  //dictionnaire d'extension d'images
  {
    "image/jpg": "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
  };

const storage = multer.diskStorage({
  //fonction qui indique que l'on va enregistré celui ci sur le disque
  //
  //1er element de l'objet "destination"
  destination: (req, file, callback) => {
    //explique dans quel dossier enregistrer les fichiers
    callback(null, "images");
    // 1er argument null pour indiquer quil n'y a pas d'erreur ,
    // 2eme argument le dossier
  },
  //
  //2eme element de l'objet "destination"'
  filename: (req, file, callback) => {
    //explique quel nom de fichier utiliser
    const name = file.originalname.split(" ").join("_"); //créer le nom du fichier
    const extension = MIME_TYPES[file.mimetype]; //aplique une extension au fichier depuis le dictionnaire
    callback(null, name + Date.now() + "." + extension);
    // 1er argument null pour indiquer quil n'y a pas d'erreur
    //2eme arguement créer le file name + horodatage (time stamp) + extension du fichier
  },
});

module.exports = multer({ storage: storage }).single("image");
