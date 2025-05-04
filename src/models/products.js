const mongoose = require('mongoose');
const validator=require('validator');
const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,

    },
    category:{
        type:String,
        required:true,
        enum:["man","woman","kids","electronics"]
    },
    description:{
        type:String,
        required:true,
        maxLength:300
    },
    size:{
        type:String,
        
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    image:{
        type:String,
        required:true,
    },
    color:{
        type:String

    }

},
{
    timestamps:true
}
);
const Products=mongoose.model("Products",productSchema)
module.exports=Products;