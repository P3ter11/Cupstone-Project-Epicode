import { Schema, model } from "mongoose";

const reviewSchema = new Schema({
    commento: {type: String, required: false},
    valutazione: { type: Number, required: true },
    utente: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    prodotto: { type: Schema.Types.ObjectId, ref: 'Product', required: true }
  },
{collection: "Review"}
);

export default model("Review", reviewSchema);