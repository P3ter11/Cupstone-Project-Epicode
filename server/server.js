import express from "express";
import { config } from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { adminRoute } from "./services/routes/admin.route.js";
import { authRoute } from "./services/routes/auth.route.js";
import { sellerRoute } from "./services/routes/seller.route.js";
import { userRoute } from "./services/routes/user.route.js";

config();

const PORT = process.env.PORT || 3001;

//Crea il server
const app = express();

app.use(express.json());
//Cors
app.use(cors());

//Google Strategy

//Rotte

app.use("/admin", adminRoute);
app.use("/auth", authRoute);
app.use("/seller", sellerRoute);
app.use("/user", userRoute);
//Connessione al server

const initServer = async() =>{
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Connesso al server");

        app.listen(PORT, () =>{
            console.log(`Sei connesso alla porta ${PORT}`);
        })
    } catch (error) {
        console.error("Connessione al database fallita!", error);
    }
}

initServer();