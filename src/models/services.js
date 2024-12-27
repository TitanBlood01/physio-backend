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
        required: true,
        default: "https://res.cloudinary.com/djnufglwv/image/upload/v1735254302/defaults/detszww9dho8aaixt1k6.png"
    }
},
{
    versionKey: false
}
); 

export default model('service', serviceSchema);