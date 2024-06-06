import { Router } from "express";
import User from "../models/user.model.js";
import { authMiddleWare } from "../../auth/index.js";
import Product from "../models/product.model.js";
import Review from "../models/review.model.js";
import cloudinaryMiddleware from "../middlewares/multer.js";
import bcrypt from "bcryptjs";

export const userRoute = Router();

//Ritorna nella pagina degli ospiti i prodotti
userRoute.get("/products", async(req, res, next) =>{
    try {
        const products = await Product.find().populate("venditore").sort({
            created_at: -1
        }).limit(15);

        if(!products)
            return res.status(404).json({message: "Nessun prodotto trovato"});
        

        res.send(products);
    } catch (error) {
        next(error);
    }
});


//Modifica il profilo dell'utente
userRoute.put("/:userId", authMiddleWare, async(req, res, next) =>{
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, req.body, {new: true});
        if(!user)
            return res.status(404).json({message: "Utente non trovato"});

        res.send(user);
    } catch (error) {
        next(error);
    }
});

//Upload dell'avatar
userRoute.patch("/:userId/avatar", cloudinaryMiddleware, async(req, res, next) =>{
    try {
        const user = await User.findByIdAndUpdate(req.params.userId, {avatar: req.file.path}, {new: true});
        await user.save();

        res.send({message: 'Avatar aggiornato con successo', avatar: user.avatar});
    } catch (error) {
        next(error);
    }
});

//Modifica della password
userRoute.patch("/change-pw", authMiddleWare, async(req, res, next) =>{
    try {
        const {oldPw, newPw} = req.body;
        const userId = req.user._id;

        const user = await User.findById(userId);
        if(!user)
            return res.status(404).json({message: "Utente non trovato"});

        const isMatch = await bcrypt.compare(oldPw, user.password);
        if(!isMatch)
            return res.status(401).json({message: "Password errata"});

        const salt = await bcrypt.genSalt(10); //genera una stringa casuale con 10 che indica il numero + alto per generare un hash forte ma comporta + tempo
        const hashedPw = await bcrypt.hash(newPw, salt); // crea l'hash per la nuova pw
        user.password = hashedPw; //assegno la nuova pw al model user.password

        await user.save();
        res.send({message: "Password modificata con successo"});
    } catch (error) {
        next(error);
    }
})

//Filtra i prodotti in base a categoria e prezzo
userRoute.post("/products/filter", async (req, res, next) =>{
    try {
        const {categoria, prezzi} = req.body;
        let query = {};

        if(categoria)
            query.categoria = {$in: categoria};

        if(prezzi && prezzi.length > 0){
            let priceQuery = [];
            prezzi.forEach(prezzo => {
                if (prezzo === '<20') priceQuery.push({ prezzo: { $lt: 20 } });
                else if (prezzo === '<50') priceQuery.push({ prezzo: { $lt: 50 } });
                else if (prezzo === '<100') priceQuery.push({ prezzo: { $lt: 100 } });
                else if (prezzo === '100-200') priceQuery.push({ prezzo: { $gte: 100, $lte: 200 } });
                else if (prezzo === '>200') priceQuery.push({ prezzo: { $gt: 200 } });
            });
            query.$or = priceQuery;
        }

        const products = await Product.find(query);
        res.send(products);
    } catch (error) {
        next(error);
    }
});

//Ritorna i prodotti con la categoria indicata
userRoute.get("/products/:category", async(req, res, next) =>{
    try {
        const categoryName = decodeURIComponent(req.params.category);
        console.log(categoryName);
        const products = await Product.find({categoria: categoryName}).sort({
            created_at: -1
        }).limit(15);

        if(!products || products.length === 0)
            return res.status(404).send({message: "Nessun prodotto trovato"});

        res.send(products);
    } catch (error) {
        next(error)
    }
});

//Ritorna un singolo prodotto
userRoute.get("/:idProduct", async(req, res, next) =>{
    try {
        const product = await Product.findById(req.params.idProduct)
        .populate("venditore");
        //.populate("recensioni");

        if(!product)
            return res.status(404).json({message: "Nessun prodotto trovato"});
        
        res.send(product);
    } catch (error) {
        next(error);
    }
});

//Ritorno i parametri del mio utente
userRoute.get("/:id", authMiddleWare, async (req, res, next) =>{
    try {
        const user = await User.findById(req.params.id);
        res.send(user);
    } catch (error) {
        next(error);
    }
});

//Modifico l'utente
userRoute.put("/:id", authMiddleWare, async (req, res, next)=>{
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            {new: true}
        );

        if(!user)
            return res.status(404).send({ message: "Utente non trovato" });

        res.status(200).send(user);
    } catch (error) {
        next(error);
    }
});

//Aggiungo un prodotto al carrello (oppure aggiungo il numero di quantità)
userRoute.post("/addProduct/:idProduct", authMiddleWare, async (req, res, next) =>{
    try {

        //Ottengo i parametri da middleware, params e body
        const userId = req.user._id;
        const productId = req.params.idProduct;
        const quantita = req.body.quantita;

        //Verifico se esiste ed è disponibile il prodotto
        const product = await Product.findById(productId);
        if(!product || product.quantita < quantita)
            return res.send({message: "Prodotto non disponibile"});

        
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).send({message: "Utente non trovato"});
        }

        let cartItem = user.carrello.find(item => item.prodotto.toString() === productId);

        //Aggiungo il prodotto al carrello
        if(cartItem)
            cartItem.quantita += quantita;
        else{
            cartItem = {prodotto: productId, quantita: quantita};
            user.carrello.push(cartItem);
        }

        await user.save();
        res.send({message: "prodotto aggiunto al carrello", carrello: user.carrello})

    } catch (error) {
        next(error);
    }
})

//Elimino un prodotto dal carrello (oppure tolgo il numero di quantità)
userRoute.delete("/deleteProduct/:idProduct", authMiddleWare, async (req, res, next)=>{
    try {

        //Ottengo i parametri da middleware, params e body
        const userId = req.user._id;
        const productId = req.params.idProduct;

        console.log(userId, productId);

        //Controllo se il carrello è vuoto
        const user = await User.findById(userId);
        if(!user.carrello)
            return res.status(404).send({message: "Impossibile eliminare, il carrello è vuoto"});

        //Cerco l'id del prodotto nel carrello
        const productCart = user.carrello.findIndex(
            item => item.prodotto.toString() === productId
        );

        //Passo ad una variabile l'oggetto prodotto
        const item = user.carrello[productCart];

        //Confronto la quantità dell'oggetto prodotto con la quantità da rimuovere
        if(item.quantita > 1)
            item.quantita -= 1;
        else if(item.quantita == 1)
            user.carrello.splice(productCart, 1);
        else
            return res.status(400).send({message: "Errore in fase di rimozione del prodotto"});

        await user.save();
        res.send({message: "Carrello aggiornato", carrello: user.carrello});


    } catch (error) {
        next(error);
    }

})

//Compro i prodotti del carrello
userRoute.delete("/buy", authMiddleWare, async (req, res, next)=>{
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        console.log("Utente trovato");

        if(user.carrello.length === 0)
            return res.status(404).send({message: "Impossibile acquistare, il carrello è vuoto"});

        //Prepara le promise per l'aggiornamento del database
       const updates = user.carrello.map(item =>{
       
            return Product.findById(item.prodotto).then(prodotto =>{
                console.log("Sono dentro al ciclo");
                prodotto.quantita -= item.quantita;
                prodotto.acquistiEffettuati += item.quantita;

                
                if(prodotto.quantita === 0)
                    prodotto.disponibile = false;
    
                return prodotto.save();
            })
        })

        await Promise.all(updates);

        // Svuota il carrello dopo l'acquisto
        user.carrello = [];
        await user.save();
        
        res.send({ message: "Acquisto completato" });

    } catch (error) {
        next(error);
    }
})

//Faccio una recensione ad un prodotto
userRoute.post("/addReview/:idProduct", authMiddleWare, async (req, res, next)=>{
    const {valutazione, commento} = req.body;
    const userId = req.user._id;
    try {
        const product = await Product.findById(req.params.idProduct);
        if(!product)
            return res.status(404).send({ message: "Prodotto non trovato" });

        const newReview = new Review({
            commento, 
            valutazione,
            utente: userId,
            prodotto: product
        });

        await newReview.save();
        product.recensioni.push(newReview._id);
        await product.save();

        res.status(201).send({message: "Recensione aggiornata con successo", review: newReview})

    } catch (error) {
        next(error)
    }
})

//Ritorno i commenti di un prodotto
userRoute.get("/:idProduct/reviews", async (req, res, next)=>{
    try {
        const product = await Product.findById(req.params.idProduct)
        .populate({
            path: "recensioni",
            populate: {path: "utente", select: "username "}
        });
            
        if(!product)
            return res.status(404).send({ message: "Prodotto non trovato" });

        res.send(product.recensioni);
    } catch (error) {
        next(error);
    }
    
})

//Ritorno i prodotti che ho nel carrello
userRoute.get("/:userId/cart", authMiddleWare, async (req, res, next)=>{
    try {
        const user = await User.findById(req.params.userId)
        .populate({
            path: "carrello",
            populate: {
                path: "prodotto", select: "nome prezzo immagine",
            }
        });

        if(!user)
            return res.status(404).send({ message: "Utente non trovato" });

        res.send(user.carrello);
    } catch (error) {
        next(error);
    }
});

//Elimino l'utente e le sue recensioni
userRoute.delete("/:userId", authMiddleWare, async (req, res, next) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);
        if(!user)
            return res.status(404).send({ message: "Utente non trovato" });

        const reviews = await Review.find({ utente: userId });

        for (const review of reviews) {
            await Product.updateMany(
              { recensioni: review._id },
              { $pull: { recensioni: review._id } }
            );
          }

        await Review.deleteMany({utente: userId});

        await User.findByIdAndDelete(userId);

        res.send({message: 'Utente e recensioni eliminati con successo'});
    } catch (error) {
        next(error);
    }
});

