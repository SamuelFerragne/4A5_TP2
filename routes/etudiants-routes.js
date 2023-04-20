const express = require("express");

const controleursEtudiant = require("../controllers/etudiants-controlleurs");
const router = express.Router();

router.post("/", controleursEtudiant.creerEtudiant);

router.get("/:etudiantId", controleursEtudiant.getEtudiantById);

router.patch("/:etudiantId", controleursEtudiant.updateEtudiant);

router.patch("/inscription/:etudiantId", controleursEtudiant.inscrireEtudiant);

router.delete("/:etudiantId", controleursEtudiant.supprimerEtudiant);

module.exports = router;
