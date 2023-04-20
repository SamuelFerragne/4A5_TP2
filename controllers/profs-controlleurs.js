const HttpErreur = require("../models/http-erreur");

const { v4: uuidv4 } = require("uuid");

const Professeur = require("../models/prof");

const getProfesseurById = async (requete, reponse, next) => {
  const professeurId = requete.params.professeurId;
  let professeur;
  try {
    professeur = await Professeur.findById(professeurId);
  } catch (err) {
    return next(
      new HttpErreur("Erreur lors de la récupération du professeur", 500)
    );
  }
  if (!professeur) {
    return next(
      new HttpErreur("Aucun professeur trouvé pour l'id fourni", 404)
    );
  }
  reponse.json({ professeur: professeur.toObject({ getters: true }) });
};

const creerProfesseur = async (requete, reponse, next) => {
  const { nom, cours } = requete.body;
  const nouveauProfesseur = new Professeur({
    id: uuidv4(),
    nom,
    cours,
  });

  try {
    await nouveauProfesseur.save();
  } catch (err) {
    const erreur = new HttpErreur("Création du professeur échouée", 500);
    return next(erreur);
  }
  reponse.status(201).json({ professeur: nouveauProfesseur });
};

const updateProfesseur = async (requete, reponse, next) => {
  const { nom } = requete.body;
  const professeurId = requete.params.professeurId;

  let professeur;

  try {
    professeur = await Professeur.findById(professeurId);
    professeur.nom = nom;
    await professeur.save();
  } catch {
    return next(
      new HttpErreur("Erreur lors de la mise à jour du professeur", 500)
    );
  }

  reponse
    .status(200)
    .json({ professeur: professeur.toObject({ getters: true }) });
};

const supprimerProfesseur = async (requete, reponse, next) => {
  const professeurId = requete.params.professeurId;
  let professeur;
  try {
    professeur = await Professeur.findById(professeurId)//.populate("cours");
  } catch {
    return next(
      new HttpErreur("Erreur lors de la suppression du professeur'", 500)
    );
  }
  if (!professeur) {
    return next(new HttpErreur("Impossible de trouver le professeur'", 404));
  }

  console.log("professeur", professeur);
  console.log("professeur.cours", professeur.cours);

  try {
    await professeur. deleteOne();
  } catch {
    return next(
      new HttpErreur("Erreur lors de la suppression du professeur'", 500)
    );
  }
  reponse.status(200).json({ message: "Professeur supprimée" });
};

const inscrireProfesseur = async (requete, reponse, next) => {
  const professeurId = requete.params.professeurId;
  const { cours } = requete.body;

  let professeur;
  let coursRechercher;
  try {
    professeur = await Professeur.findById(professeurId);
    professeur.cours.push(cours);
    await professeur.save();
  } catch {
    return next(
      new HttpErreur("Erreur lors de la mise à jour du professeur", 500)
    );
  }
  if (!professeur) {
    return next(new HttpErreur("Impossible de trouver le professeur", 404));
  }

  try {
    coursRechercher = await Cours.findById(cours._id);
    coursRechercher.professeurs.push(professeur);
    console.log("1");
    await coursRechercher.save();
    console.log("2");
  } catch {
    return next(
      new HttpErreur(
        "Erreur lors de l'inscription du professeur au cours'",
        500
      )
    );
  }
  reponse.status(200).json({ message: "Professeur inscrit" });
};


exports.creerProfesseur = creerProfesseur;
exports.getProfesseurById = getProfesseurById;
exports.updateProfesseur = updateProfesseur;
exports.supprimerProfesseur = supprimerProfesseur;
exports.inscrireProfesseur = inscrireProfesseur;