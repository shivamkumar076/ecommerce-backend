const express=require('express');
const router=express.Router();
const { userAuth } = require('../middleware/userAuth');


router.get('/profileview',userAuth,async(req,res)=>{

    try{
        const user=req.user;
        res.status(200).json({
            message:"profile get successfully",
            user
        })
        

    }catch(err){
        console.error('Error profile Error',err)
        res.status(404).json({
            message:"profile view error",
            data:data
        })

    }

})

module.exports=router