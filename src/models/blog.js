import { Schema, model } from "mongoose";

const blogSchema = new Schema({
    tituloBlog: {
        type: String,
        required: true
    },
    contenidoBlog: {
        type: String,
        required: true
    },
    imagenesBlog: [{
        type: String,
        required: true
    }],
    videoBlog: {
        type: String,
        required: false
    },
    autorBlog: {
        type: Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
}, 
{
    timestamps: true,
    versionKey: false
});

export default model('blog', blogSchema);