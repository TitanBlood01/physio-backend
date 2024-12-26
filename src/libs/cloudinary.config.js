import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv';

dotenv.config(); // Carga las variables de entorno desde .env

// Usar la URL completa desde el archivo .env
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL, 
  secure: true, // para usar HTTPS
});

export default cloudinary;

