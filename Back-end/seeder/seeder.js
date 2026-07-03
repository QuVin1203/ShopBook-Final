import mongoose from "mongoose";
import products from './data.js'
import Product from "../models/product.js";
const seedProducts = async ()=>{
    try{
        await mongoose.connect('mongodb+srv://admin:Qvinh1203@shopbook.juhpvjz.mongodb.net/?appName=shopbook')

        await Product.deleteMany()
        console.log('product are deleted')
        await Product.insertMany(products)
        console.log('product are added')
        process.exit()

    }catch(error){
        console.log(error.message)
        process.exit()
    }
}
seedProducts()