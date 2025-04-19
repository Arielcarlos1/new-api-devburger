import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    user: {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },

    products: [
      {
        id: {
          type: String, // Pode ser um UUID ou ObjectId
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number, // Alterado para Number
          required: true,
        },
        category: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number, // Alterado para Number
          required: true,
        },
      },
    ],
    status: {
      type: String,
      enum: ["pending", "preparing", "delivered", "canceled"], // Definindo status válidos
      required: true,
    },
  },
  { timestamps: true } // Correção aqui
);

export default mongoose.model("Order", OrderSchema);
