import { v2 as cloudinary } from "cloudinary";
import dotenv from 'dotenv';

dotenv.config(); // Carga las variables de entorno desde .env

console.log(process.env.CLOUDINARY_URL);

// Usar la URL completa desde el archivo .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
  debug: true,
});

(async () => {
  try {
    const result = await cloudinary.api.resources({ max_results: 1 });
    console.log("Cloudinary está funcionando:", result);
  } catch (error) {
    console.error("Error al conectar con Cloudinary:", error.message);
  }
})();

export default cloudinary;