import multer from "multer";
import {v2 as cloudinary} from "cloudinary";
import {CloudinaryStorage} from "multer-storage-cloudinary";
import { config } from "dotenv";

config()
          
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET 
});

const options = {
    storage: new CloudinaryStorage({
      cloudinary,
      params: {
        folder: "avatars"
      },
    }),
  };
  
  export default multer(options).single("avatar");