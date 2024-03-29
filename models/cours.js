const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const coursSchema = new Schema({
  nom: { type: String, required: true },
  prof: { type: mongoose.Types.ObjectId, required: true, ref: "Prof" },
  etudiants: [
    { type: mongoose.Types.ObjectId, required: true, ref: "Etudiant" },
  ],
});

module.exports = mongoose.model("Cours", coursSchema);
