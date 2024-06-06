import { Router } from "express";
import passport from "passport";
import { authMiddleWare } from "../../auth/index.js";
import { generateJWT } from "../../auth/index.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const authRoute = Router();

authRoute.get("/", async (req, res, next) =>{
    res.send("Login page");
})

//Crea un nuovo utente
authRoute.post("/register", async (req, res, next) => {
    try {
        const newUser = await User.create({
            ...req.body,
            password: await bcrypt.hash(req.body.password, 10)
        })
        res.send(newUser);
    } catch (error) {
        next(error);
    }
})

//Login utente
authRoute.post("/login", async (req, res, next) =>{
    try {
        const userFound = await User.findOne({email: req.body.email});
        
        if(userFound){
            const isPwMatching = await bcrypt.compare(req.body.password, userFound.password);
            if(isPwMatching){
                const token = await generateJWT({email: userFound.email});

                //Genera Token
                res.send({user: userFound, token});
            } else 
                res.status(401).send("Password non corretta");
        }else 
        res.status(404).send("Utente non trovato");
    } catch (error) {
        next(error);
    }
})

//Ritorna l'utente se passa il middleware di autenticazione
authRoute.get("/me", authMiddleWare, async (req, res, next) =>{
    try {
        //utilizzando authMiddleware si può accedere all'id dell'utente
        let user = await User.findById(req.user.id);
        res.send(user);
    } catch (error) {
        next(error);
    }
});

