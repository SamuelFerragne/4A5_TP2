const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const Schema = mongoose.Schema;

const professeurSchema = new Schema({
  nom: { type: String, required: true },
  cours: [{ type: mongoose.Types.ObjectId, ref: "Cours" }],
});

module.exports = mongoose.model("Professeur", professeurSchema);