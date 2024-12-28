import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/physioActiveDB"

mongoose.connect(MONGO_URI)
    .then(
        db => console.log('DB is connected')
    ).catch(
        error => console.log(error)
    )