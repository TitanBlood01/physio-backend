import { Schema, model } from "mongoose";

const serviceSchema = new Schema({
    tituloService: {
        type: String, 
        required: true
    },
    infoService: {
        type: String, 
        required: true
    },
    descriptionService: {
        type: String, 
        required: true
    },
    imageService: {
        type: String, 
        required: true
    }
},
{
    versionKey: false
}
); 

export default model('service', serviceSchema);