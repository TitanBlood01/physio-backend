import { Schema, model } from "mongoose";

const teamSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    apellido: {
        type: String,
        required: true
    },
    carnetIdentidad:{
        type: String,
        required: true,
        unique: true
    },
    matriculaProf: {
        type: String,
        unique: false,
        required: false,
    },
    experiencia: {
        type: [String],
    },
    posicion: {
        type: String,
        required: true
    },
    abreviacionCargo: {
        type: String,
        default: "", // Puede ser vacío si no aplica
        required: false
    },
    isPhysiotherapeust: {
        type: Boolean,
        default: false
    },
    fotoPerfil: {
        type: String,
        required: true,
        default: "https://res.cloudinary.com/djnufglwv/image/upload/v1735163192/user_6543634_gk6cs4.png"
    }
})

export default model('team', teamSchema);