import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.config.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    let folder = "default-folder";
    if (req.body.model === 'team') {
      folder = "team-images"; 
    } else if (req.body.model === 'service'){
      folder = 'service-images'
    } else if (req.body.model === 'blog'){
      folder = 'blog-images'
    }

    return {
      folder, //usar el folder determinado dinamicamente
      allowed_formats: ["jpg", "png", "jpeg"], // Formatos permitidos
      transformation: [
        { quality: "auto:best", fetch_format: "auto" }  // Optimización automática de calidad y formato
      ]
    }
  },
});

const upload = multer({ storage });

export default upload;
