const HttpErreur = require("../models/http-erreur");

const { v4: uuidv4 } = require("uuid");

const Etudiant = require("../models/etudiant");

const getEtudiantById = async (requete, reponse, next) => {
  const etudiantId = requete.params.etudiantId;
  let etudiant;
  try {
    etudiant = await Etudiant.findById(etudiantId);
  } catch (err) {
    return next(
      new HttpErreur("Erreur lors de la récupération de l'étudiant", 500)
    );
  }
  if (!etudiant) {
    return next(new HttpErreur("Aucun étudiant trouvée pour l'id fourni", 404));
  }
  reponse.json({ etudiant: etudiant.toObject({ getters: true }) });
};

const creerEtudiant = async (requete, reponse, next) => {
  const { nom, cours } = requete.body;
  const nouvelleEtudiant = new Etudiant({
    id: uuidv4(),
    nom,
    cours,
  });

  try {
    await nouvelleEtudiant.save();
  } catch (err) {
    const erreur = new HttpErreur("Création de l'étudiant échouée", 500);
    return next(erreur);
  }
  reponse.status(201).json({ etudiant: nouvelleEtudiant });
};

const updateEtudiant = async (requete, reponse, next) => {
  const { nom } = requete.body;
  const etudiantId = requete.params.etudiantId;

  let etudiant;

  try {
    etudiant = await Etudiant.findById(etudiantId);
    etudiant.nom = nom;
    await etudiant.save();
  } catch {
    return next(
      new HttpErreur("Erreur lors de la mise à jour de l'étudiant", 500)
    );
  }

  reponse.status(200).json({ etudiant: etudiant.toObject({ getters: true }) });
};

const supprimerEtudiant = async (requete, reponse, next) => {
  const etudiantId = requete.params.etudiantId;
  let etudiant;
  try {
    etudiant = await Etudiant.findById(etudiantId).populate;
  } catch (err) {
    return next(
      new HttpErreur("Erreur lors de la récupération de l'étudiant", 500)
    );
  }
  if (!etudiant) {
    return next(new HttpErreur("Aucun étudiant trouvée pour l'id fourni", 404));
  }

  try {
    await etudiant.remove();
    //etudiant.cours.etudiants.pull(etudiant);
    //await etudiant.cours.save();
  } catch {
    return next(
      new HttpErreur("Erreur lors de la suppression de l'étudiant' ", 500)
    );
  }
  reponse.status(200).json({ message: "Étudiant supprimée" });
};

exports.creerEtudiant = creerEtudiant;
exports.getEtudiantById = getEtudiantById;
exports.updateEtudiant = updateEtudiant;
exports.supprimerEtudiant = supprimerEtudiant;
