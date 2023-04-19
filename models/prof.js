const mongoose = require("mongoose");
<<<<<<< HEAD

const Schema = mongoose.Schema;

const etudiantSchema = new Schema({
  nom: { type: String, required: true },
  cours: [{ type: mongoose.Types.ObjectId, required: true, ref: "Cours" }],
});

module.exports = mongoose.model("Prof", etudiantSchema);
=======
const { v4: uuidv4 } = require("uuid");

const Schema = mongoose.Schema;

const professeurSchema = new Schema({
  nom: { type: String, required: true },
  cours: [{ type: mongoose.Types.ObjectId, ref: "Cours" }],
});

module.exports = mongoose.model("Professeur", professeurSchema);
>>>>>>> c0d9a2f8759d88c8f688ed22c747b403f6f34fe3
