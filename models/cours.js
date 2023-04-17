const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const coursSchema = new Schema({
    prof:{type: mongoose.Types.ObjectId,required: true, ref:"Prof"},
    id: {type: Number, required: true, unique:true},
    etudiants: [{type: mongoose.Types.ObjectId, required: true, ref:"etudiant"}]
});



module.exports = mongoose.model("Cours", coursSchema);