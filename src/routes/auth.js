const express=require('express');
const router=express.Router();
const User=require('../models/user');
const bcrypt=require('bcrypt');
const {validationsignup}=require('../utils/validation');
//User signup
//Method POST
router.post('/auth/signup',async (req,res)=>{
    try{
        validationsignup(req);
        const {firstName,lastName,email,password}=req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(409).json({ message: "Email already in use" });
        }
        const passwordHash=await bcrypt.hash(password,10);
        const user=new User({
            firstName,
            lastName,
            email,
            password:passwordHash
        })
        const saveddata=await user.save();
        console.log('save data',saveddata)
        const token=await user.getJWT();
        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            // secure: process.env.NODE_ENV === 'production', // Ensures cookies are only sent over HTTPS in production
            maxAge: 60 * 60 * 1000, // Cookie expiration time (24 hours)
            sameSite: 'strict' // Prevents the browser from sending this cookie along with cross-site requests
        });
        res.status(200).json({
            messege:"data save successfully",
            token,
           data:{
            id:saveddata._id,
            firstName:saveddata.firstName,
            lastName:saveddata.lastName,
            email:saveddata.email

           }
        })
    }catch(err){
        console.error('Error during signup:', err); // Log the full error
       res.status(500).send("Error signup",+err.message);
        }
});
router.post('/auth/login',async (req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email:email});
        if(!user){
            throw new Error("invalid credentials")
        }
        const ispassword= await user.validatepassword(password);
        if(ispassword){
            const token=await user.getJWT();
            console.log(token);
            res.cookie('token', token, {
                httpOnly: true, 
                // secure: process.env.NODE_ENV === 'production',
                maxAge:  60 * 60 * 1000, 
                sameSite: 'strict' 
            });
            res.json({
                message:"user login successfully",
                data:user,
            
            })
        }else {
            throw new Error("invalid credentials")
        }
    }catch(err){
        console.error("Login error:", err);  // Add this
res.status(500).json({ message: "Login error", error: err.message });
    }
});
router.post('/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: "Logged out successfully" });
});


module.exports=router;



