import mongoose from "mongoose";


const CarritoCollection = "productos";

const CarritoSchema = new mongoose.Schema({
    timestamp: { type: String, require: true, max: 255},
    productos: {type: String, require:true, max: 255},
    id:{type: Number, require: true}
})

export const carrito = mongoose.model(CarritoCollection, CarritoSchema); 