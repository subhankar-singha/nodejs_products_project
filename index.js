import express from "express";
import dotenv from "dotenv";
import{connectDB} from "./config/db.js";
import Product from "./models/Product.model.js";

dotenv.config();
const app = express();

app.use(express.json());

app.get('/products/',async (req, res)=>{
    try{
        const products = await Product.find();
        if (!products || products.length === 0) {
            return res.status(404).json({success: false, message: "Products not found"});
        }
        res.status(200).json({success: true, data: products});
    }catch (error){
        console.error("Error: ", error.message);
        res.status(500).json({success: false, message: "Server Error"});

    }
})

app.get('/products/:id',async (req, res) => {
    const {id} = req.params;
    if (!id) {
        return res.status(400).json({success: false, message: "Please provide a valid product ID"});
    }
    try {
        const products = await Product.find({_id: id});
        if (!products || products.length === 0) {
            return res.status(404).json({success: false, message: "Products not found"});
        }
        res.status(200).json({success: true, data: products});
    } catch (error){
        console.error("Error: ", error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
});

app.post('/products/',async (req, res) => {
    const product = req.body;
    if (!product.name || !product.price || !product.image) {
        return res.status(400).json({success: false, message: "Please provide all fields"});
    }
    const newProduct = new Product(product)
    try {
        await newProduct.save();
        res.status(201).json({success: true, message: "Created"})
        console.log("Product created successfully");
    } catch (error) {
        console.error("Error: ", error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
})

app.delete('/products/:id',async (req, res) => {
    const {id} = req.params;
    if (!id) {
        return res.status(400).json({success: false, message: "Please provide a valid product ID"});
    }
    try {
        const product = await Product.findByIdAndDelete({_id: id});
        if (!product) {
            return res.status(404).json({success: false, message: "Product not found"});
        }
        res.status(200).json({success: true, message: "Product deleted successfully"});
    } catch (error) {
        console.error("Error: ", error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
})

app.put('/products/:id',async (req, res) => {
    const {id} = req.params;
    const productData = req.body;
    if (!id || !productData.name || !productData.price || !productData.image) {
        return res.status(400).json({success: false, message: "Please provide atleast 1 field"});
    }
    try {
        const product = await Product.findByIdAndUpdate(id, productData, {new: true});
        if (!product) {
            return res.status(404).json({success: false, message: "Product not found"});
        }
        res.status(200).json({success: true, data: product});
    } catch (error) {
        console.error("Error: ", error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
})

app.listen(process.env.PORT,()=>{
    connectDB();
    console.log("App is running on Port 3000");
})

//this is a test change