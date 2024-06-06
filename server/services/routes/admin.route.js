import { Router } from "express";
import User from "../models/user.model.js";
import { isAdmin } from "../../auth/index.js";
import { authMiddleWare } from "../../auth/index.js";
import Product from "../models/product.model.js";

export const adminRoute = Router();

    //Ritorna tutti gli utenti tranne l'admin che ha richiesto la fetch
    adminRoute.get("/getUsers", authMiddleWare, isAdmin, async (req, res, next) =>{
        const userId = req.user._id;
        try {
            let users = await User.find({ _id: { $ne: userId } });
            res.send(users);
        } catch (error) {
            next(error);
        }
    })


    //Elimina un utente
    adminRoute.delete("/:idUser", authMiddleWare, isAdmin, async (req, res, next) => {
        try {
            let user = await User.findByIdAndDelete(req.params.idUser);
            if(!user)
                return res.status(404).send({ message: "Utente non trovato" });

            res.sendStatus(204);
        } catch (error) {
            next(error)
        }
    });

    //Ritorna tutti i prodotti
    adminRoute.get("/products", authMiddleWare, isAdmin, async (req, res, next) =>{
        try {
            const products = await Product.find().populate('venditore');

            if(!products)
                return res.status(404).send({ message: "Prodotti non trovati" });

            res.send(products);
        } catch (error) {
            next(error);
        }
    });

    //Elimina un prodotto
    adminRoute.delete("/:id", authMiddleWare, isAdmin, async(req, res, next) =>{
        try {
            const product = await Product.findByIdAndDelete(req.params.id);
            if(!product)
                return res.status(404).json({message: "Prodotto non trovato"});
    
            res.status(204).send(true);
        } catch (error) {
            next(error);
        }
    })


