import jwt from "jsonwebtoken";
import User from '../services/models/user.model.js';

//FUNZIONE PER GENERARE TOKEN
export const generateJWT = (payload) =>{

    return new Promise((resolve, reject) =>{
        jwt.sign(
            //inserimento payload (dati)
            payload,
            //Inseriemnto jwt preso da .env
            process.env.JWT_SECRET,
            //data scadenza token
            { expiresIn: "1d" }, 
            //callback di errore
            (err, token)=>{
                if(err)
                    reject(err);
                else
                    resolve(token);
            }

        )
    })
}

// Controllo se il ruolo dell'utente è "seller"
export function isSeller (req, res, next){
    //Controllo autenticazione utente
    if (!req.user) {
        return res.status(401).send({ message: "Non autenticato" });
    }
    
    if (req.user.ruolo !== 'seller') {
        return res.status(403).send({ message: "Accesso consentito solo ai venditori" });
    }

    // Se l'utente è un venditore, continua con il middleware successivo
    next();
}

// Controllo se il ruolo dell'utente è "seller"
export function isAdmin (req, res, next){
    //Controllo autenticazione utente
    if (!req.user) {
        return res.status(401).send({ message: "Non autenticato" });
    }
    
    if (req.user.ruolo !== 'admin') {
        return res.status(403).send({ message: "Accesso consentito solo ai venditori" });
    }

    // Se l'utente è un admin, continua con il middleware successivo
    next();
}





//FUNZIONE PER GENERARE VALIDITA' TOKEN
export const verifyJWT = (token) =>{
    
    return new Promise((resolve, reject) =>{
        //verifico il token con 'verify' passando token jwtsecret e una callback in caso di errore o decoded
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) =>{
            if(err)
                reject("Invalid Token");
            else
                resolve(decoded);
        });
    })
}

//MIDDLEWARE DA UTILIZZARE PER L'AUTORIZZAZIONE
export const authMiddleWare = async (req, res, next) =>{
    try {

        //Controllo se è stato fornito il token all'header
        if(!req.headers.authorization)
            //Richiedi il login
            res.status(400).send("Effettua il login");
        else{

            //Il token è stato fornito e si va a togliere la stringa "Bearer" e si verifica il token attraverso verifyJWT
            const decoded = await verifyJWT(
                req.headers.authorization.replace("Bearer ", "")
            );
            
            //Verifica se il token esiste attraverso la proprietà exp
            if(decoded.exp){
                //Si toglie dal token issuedat e exp
                delete decoded.iat;
                delete decoded.exp;

                const me = await User.findOne({
                    ...decoded
                });

                if(me){
                    req.user = me;
                    next();
                }else
                    res.status(401).send("Utente non trovato");
                } else{
                    res.status(401).send("Rieffettua il login");
                }
            }
        
            
    } catch (error) {
        next(error)
    }
};