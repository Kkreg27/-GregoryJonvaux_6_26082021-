const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth"); //Gestion des authentifications
const multer = require("../middleware/multer-config"); //Gestion des images
const sauceCtrl = require("../controllers/sauces"); //Gestion de la logique de requetes

router.get("/", auth, sauceCtrl.getAllSauce);
router.post("/", auth, multer, sauceCtrl.createSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.put("/:id", auth, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);

router.post("/:id/like", auth, sauceCtrl.likeSauce);

module.exports = router;
