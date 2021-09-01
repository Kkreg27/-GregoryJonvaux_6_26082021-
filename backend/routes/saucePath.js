const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const auth = require("../middleware/auth"); //Gestion des authentifications
const multer = require("../middleware/multer-config"); //Gestion des images
const sauceCtrl = require("../controllers/sauces"); //Gestion de la logique de requetes

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // start blocking after 20 requests
});

router.get("/", auth, sauceCtrl.getAllSauce);
router.post("/", auth, apiLimiter, multer, sauceCtrl.createSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.put("/:id", auth, apiLimiter, multer, sauceCtrl.modifySauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);

router.post("/:id/like", auth, sauceCtrl.likeSauce);

module.exports = router;
