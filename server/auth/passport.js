import GoogleStrategy from "passport-google-oauth20";
import "dotenv/config";
import User from "../services/models/user.model.js";
import { generateJWT } from "./index.js";


//Opzioni per configurare OAuth di google
const options = {
    //Tutti questi parametri sono presi dalla console di google oltre alla callback che verrà eseguita quando un utente esegue un'autenticazione
    clientID: process.env.G_CLIENT_ID,
    clientSecret: process.env.G_CLIENT_SECRET,
    callbackURL: process.env.G_CALLBACK,
}

//Crea un'istanza google strategy
const googleStrategy = new GoogleStrategy(options, async(accessToken, refreshToken, profile, passportNext) =>{
    
    try {
        //Destrutturazione dell'oggetto profile e si prendono i dati che servono
        const {email, name, surname, sub, picture} = profile._json;

        //Verifica dell'utente se esiste già nel database
        const user = await User.findOne({email});

        if(user){
            //Se esiste si crea il token
            const accToken = await createAccessToken({
                _id: user._id
            })

            passportNext(null, {accToken})
        }else {
            const newUser = new User({
                email: email,
                googleId: sub
            });

            await newUser.save();

            //Genera token
            const accToken = await generateJWT({
                email: newUser.email
            })

            //Chiamo la callback passando null come errore e accToken come secondo parametro
            passportNext(null, {accToken})
        }


    } catch (error) {
        passportNext(error);
    }
});

export default googleStrategy;