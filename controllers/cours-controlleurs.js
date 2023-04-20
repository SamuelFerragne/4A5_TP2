const { response } = require("express");
const { default: mongoose, mongo } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const HttpErreur = require("../models/http-erreur");

const Cours = require("../models/cours");
const Prof = require("../models/prof");

const getCoursById = async (requete, reponse, next) => {
  const coursId = requete.params.coursId;
  let cours;
  try {
    cours = await Cours.findById(coursId);
  } catch (err) {
    return next(new HttpErreur("Erreur lors de la récupération du cours", 500));
  }
  if (!cours) {
    return next(new HttpErreur("Aucun cours trouvée pour l'id fourni", 404));
  }
  reponse.json({ cours: cours.toObject({ getters: true }) });
};

const creerCours = async (requete, reponse, next) => {
  const { nom, prof, etudiants } = requete.body;
  const nouveauCours = new Cours({
    nom,
    prof,
    etudiants
  });

  let enseignant;
    try {
    enseignant = await Prof.findById(prof._id);
  } catch (err) {
    return next(
      new HttpErreur("Erreur lors de la récupération du prof", 500)
    );
  }
  if (!enseignant) {
    return next(new HttpErreur("Aucun prof trouvée pour l'id fourni", 404));
  }


  try {
    await nouveauCours.save();
    enseignant.cours.push(nouveauCours);
    await enseignant.save();
  } catch (err) {
    const erreur = new HttpErreur("Création du cours échoué", 500);
    return next(erreur);
  }
  reponse.status(201).json({ cours: nouveauCours });
};

const updateCours = async (requete, reponse, next) => {
  const { nom } = requete.body;
  const coursId = requete.params.coursId;

  let cours;

  try {
    cours = await Cours.findById(coursId);
    cours.nom = nom;
    console.log(cours);
    await cours.save();
  } catch {
    return next(new HttpErreur("Erreur lors de la mise à jour du cours", 500));
  }

  reponse.status(200).json({ cours: cours.toObject({ getters: true }) });
};

const supprimerCours = async (requete, reponse, next) => {
  const coursId = requete.params.coursId;
  let cours;
  try {
    cours = await Cours.findById(coursId).populate("etudiants");
  } catch {
    return next(new HttpErreur("Erreur lors de la suppression du cours", 500));
  }
  if (!cours) {
    return next(new HttpErreur("Impossible de trouver le cours", 404));
  }

  try {
    await cours.deleteOne();
    if(cours.etudiants.length > 0){
      cours.etudiants.cours.pull(cours);
      await cours.etudiants.save();
    }
    cours.prof.cours.pull(cours);
    await cours.prof.save();
  } catch {
    return next(new HttpErreur("Erreur lors de la suppression du cours", 500));
  }
  reponse.status(200).json({ message: "Cours supprimé" });
};

exports.getCoursById = getCoursById;
exports.creerCours = creerCours;
exports.updateCours = updateCours;
exports.supprimerCours = supprimerCours;
