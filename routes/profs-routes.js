const express = require("express");

const controleursProfesseur = require("../controllers/profs-controlleurs");
const router = express.Router();

router.post("/", controleursProfesseur.creerProfesseur);

router.get("/:professeurId", controleursProfesseur.getProfesseurById);

router.patch("/:professeurId", controleursProfesseur.updateProfesseur);

router.delete("/:professeurId", controleursProfesseur.supprimerProfesseur);

module.exports = router;
