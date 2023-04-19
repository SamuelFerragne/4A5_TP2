const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);

const coursRoute = require("./routes/cours-routes");
const etudiantRoute = require("./routes/etudiants-routes");
const profRoute = require("./routes/profs-routes");
const HttpErreur = require("./models/http-erreur");

const app = express();

app.use(bodyParser.json());

<<<<<<< HEAD
//app.use("/api/Cours", coursRoute);
app.use("/api/Etudiant", etudiantRoute);
=======
app.use("/api/Cours", coursRoute);
//app.use("/api/Etudiant", etudiantRoute);
>>>>>>> 890e3d7ada18d1a1810b76ef4591ab26a71218f6
//app.use("/api/Prof", profRoute);

app.use((requete, reponse, next) => {
  return next(new HttpErreur("Route non trouvée", 404));
});

app.use((error, requete, reponse, next) => {
  if (reponse.headerSent) {
    return next(error);
  }
  reponse.status(error.code || 500);
  reponse.json({
    message: error.message || "Une erreur inconnue est survenue",
  });
});

mongoose
  .connect("mongodb://127.0.0.1:27017")
  .then(() => {
    app.listen(5000);
    console.log("Connexion à la base de données réussie");
  })
  .catch((erreur) => {
    console.log(erreur);
  });
