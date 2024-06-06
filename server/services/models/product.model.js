import { Schema, model } from "mongoose";

    const productSchema = new Schema({
        nome: {type: String, required: true},
        prezzo: {type: Number, required: true},
        descrizione: {type: String, required: true},
        categoria: {type: String, required: true},
        immagine: {type: String, required: true},
        quantita: {type: Number, required: true},
        acquistiEffettuati: {type: Number, required: true, default: 0},
        disponibile: {type: Boolean, required: true, default: true},
        recensioni: [{ type: Schema.Types.ObjectId, ref: "Review" }],
        venditore: {type: Schema.Types.ObjectId, ref: "User", required: true}
        
    },{
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    },
    
        {collection: "Product"}
    )

export default model("Product", productSchema);