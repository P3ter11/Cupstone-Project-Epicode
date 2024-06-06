import { Router } from "express";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import { isSeller, authMiddleWare } from "../../auth/index.js";

export const sellerRoute = Router();


//Ritorna tutti i prodotti rilasciati dal venditore in ordine dal più recente
sellerRoute.get("/", authMiddleWare, isSeller, async(req, res, next) =>{
    try {
        const products = await Product.find({venditore: req.user._id})
        .populate('venditore')
        .sort({created_at: -1});

        res.send(products);
    } catch (error) {
        next(error);
    }
})

//Aggiunge un nuovo prodotto
sellerRoute.post("/", authMiddleWare, isSeller, async(req, res, next) =>{
    try {
        const product = new Product({
            ...req.body, 
            acquistiEffettuati: req.body.acquistiEffettuati || 0,
            venditore: req.user._id
        });

        await product.save();
        res.send(product);
    } catch (error) {
        next(error);
    }
})

//Elimina un prodotto
sellerRoute.delete("/:id", authMiddleWare, isSeller, async(req, res, next) =>{
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if(!product)
            return res.status(404).json({message: "Prodotto non trovato"});

        res.status(204).send(true);
    } catch (error) {
        next(error);
    }
})

//Elimina il proprio account Seller
sellerRoute.delete("/:id", authMiddleWare, isSeller, async(req, res, next) =>{
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user)
            return res.status(404).json({message: "Impossibile eliminare utente"});

        res.status(204).send(true);
    } catch (error) {
        next(error);
    }
})

//Modifica un prodotto
sellerRoute.put('/:id', authMiddleWare, isSeller, async(req,res,next) =>{
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true});
        
        if(!product)
            return res.status(404).send({ message: 'Prodotto non trovato' });

        res.status(200).send(true);
    } catch (error) {
        next(error);
    }
});

//Ritorna il numero acquisti effettuati di tutti i prodotti
sellerRoute.get('/purchases', authMiddleWare, isSeller, async(req, res, next) =>{
    try {
        const sellerId = req.user._id;

        const result = await Product.aggregate([
            { $match: { venditore: sellerId } },
            {
              $group: {
                _id: null,
                totalAcquistiEffettuati: { $sum: "$acquistiEffettuati" },
              }
            }
        ]);

        if(!result.length)
            return res.status(404).send({ message: 'Nessun acquisto effettuato'});

        res.status(200).send(result[0]);
        
    } catch (error) {
        next(error);
    }
})

//Mi ritorna il numero di prodotti inseriti
sellerRoute.get('/products', authMiddleWare, isSeller, async(req, res, next) =>{
    try {
        const sellerId = req.user._id;
        const productCount = await Product.countDocuments({ venditore: sellerId });
        res.status(200).send({numero: productCount});
    } catch (error) {
        next(error);
    }
})