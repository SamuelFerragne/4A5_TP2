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
    return next(
      new HttpErreur("Erreur lors de la récupération du cours", 500)
    );
  }
  if (!cours) {
    return next(new HttpErreur("Aucun cours trouvée pour l'id fourni", 404));
  }
  reponse.json({ cours: cours.toObject({ getters: true }) });
};

const creerCours = async (requete, reponse, next) => {
  const { prof, etudiants } = requete.body;
  const nouveauCours = new Cours({
    id: uuidv4(),
    prof,
    etudiants
  });

  let enseignant;

  try {
    enseignant = await Prof.findById(enseignant);
    
  } catch {
    
    return next(new HttpErreur("Création du cours échoué", 500));
  }

  if (!enseignant) {
    return next(new HttpErreur("Professeur non trouvé selon le id"), 504);
  }

  try {

    
    await nouveauCours.save();
    //Ce n'est pas le push Javascript, c'est le push de mongoose qui récupe le id de la place et l'ajout au tableau de l'utilisateur
    enseignant.places.push(nouveauCours);
    await enseignant.save();
    //Une transaction ne crée pas automatiquement de collection dans mongodb, même si on a un modèle
    //Il faut la créer manuellement dans Atlas ou Compass
  } catch (err) {
    const erreur = new HttpErreur("Création du cours échoué", 500);
    return next(erreur);
  }
  reponse.status(201).json({ cours: nouveauCours });
};

const updateCours = async (requete, reponse, next) => {
  const { prof, etudiants } = requete.body;
  const coursId = requete.params.coursId;

  let cours;

  try {
    cours = await Cours.findById(coursId);
    cours.prof = prof;
    cours.etudiants = etudiants;
    await cours.save();
  } catch {
    return next(
      new HttpErreur("Erreur lors de la mise à jour du cours", 500)
    );
  }

  reponse.status(200).json({ cours: cours.toObject({ getters: true }) });
};

const supprimerCours = async (requete, reponse, next) => {
  const coursId = requete.params.coursId;
  let cours;
  try {
    cours = await Cours.findById(coursId).populate("etudiants");
  } catch {
    return next(
      new HttpErreur("Erreur lors de la suppression du cours", 500)
    );
  }
  if(!cours){
    return next(new HttpErreur("Impossible de trouver le cours", 404));
  }

  try{

    
    await cours.remove();
    cours.etudiants.cours.pull(cours);
    await cours.etudiants.save()

  }catch{
    return next(
      new HttpErreur("Erreur lors de la suppression du cours", 500)
    );
  }
  reponse.status(200).json({ message: "Cours supprimé" });
};

exports.getCoursById = getCoursById;
exports.creerCours = creerCours;
exports.updateCours = updateCours;
exports.supprimerCours = supprimerCours;
