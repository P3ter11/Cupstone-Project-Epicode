import { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
      username: {
          type: String,
          required: true,
          unique: true
      },
  
      password: {
          type: String ,
          required: true,
      },
  
      email: {
          type: String ,
          required: true,
          unique: true
  
      }, 
      avatar:{         
            type: String ,
            required: false,   
      },

      ruolo: {
        type: String,
        required: true,
        enum: ['user', 'seller', 'admin'],
        default: 'user',
      },

      carrello: {
        type: [{
            prodotto: { type: Schema.Types.ObjectId, ref: 'Product' },
            quantita: { type: Number, required: true, min: 1 }
        }],
        required: false,
        validate: {
            validator: function(v) {
                return this.ruolo === 'user' || v.length === 0;
            },
            message: props => `Il carrello è permesso solo per gli utenti con ruolo 'user'.`
        }
    }

    },
    { collection: "User" }
  )
  
  export default model("User", userSchema);