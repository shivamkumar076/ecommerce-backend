const express=require('express');
const mongoose=require('mongoose');
const cors = require("cors");
const app=express();
const cookieParser = require("cookie-parser");

app.use(express.json());
require('dotenv').config();
const PORT=process.env.PORT || 4040;

app.use(cors({
    origin: "http://localhost:5173",
    
    credentials: true,
}));

app.use(cookieParser());

app.use('/uploads', express.static('uploads'));
app.use("/",require('./routes/auth'));
app.use('/',require('./routes/profile'));
app.use("/",require('./routes/products'));
app.use('/',require('./routes/cart'));
app.use('/',require('./routes/order'));


mongoose.connect(process.env.MONGODB_URL).
then(()=>{
    console.log("Database connection successfully")
    app.listen(PORT,()=>{
        console.log(`server is listen port ${PORT}`);
    })
}).catch((err)=>{
    console.error("mongodb connection error ",err)

});
