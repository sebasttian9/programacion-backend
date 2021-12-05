import mongoose from "mongoose";


const productoCollection = "productos";

const ProductosSchema = new mongoose.Schema({
    title: { type: String, require: true, max: 255},
    price: {type: Number, require:true},
    thumbnail: {type: String, require: true},
    id:{type: Number, require: true}
})

export const productos = mongoose.model(productoCollection, ProductosSchema); 