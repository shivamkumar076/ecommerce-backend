const JWT=require('jsonwebtoken');
const User=require('../models/user');


const userAuth= async (req,res,next )=>{
    try{
        const token=req.cookies.token;
        if(!token){
            return  res.status(401).json({
                message:'token invalid'
            })
            
        }
        const decode=await JWT.verify(token,"Shivam@123");
        const user=await User.findById(decode._id);
        if(!user){
            return res.status(401).json({message:'invalid user'})
        }
        req.user=user;
        next();

    }catch(err){
        console.error('user auth error',err);
        res.status(500).json({
            message:'userAuth error',
            Error:err.message,
        })
    }

};
function isAdminAuth(req, res, next) {
    if (req.user.role !== 'isAdmin') {
        return res.status(403).json({ message: "Forbidden: Admin access required." });
    }
    next();
}
module.exports={userAuth,isAdminAuth};