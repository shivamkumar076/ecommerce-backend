const express=require('express');
const router=express.Router();
const {userAuth}=require('../middleware/userAuth');
const Cart = require('../models/cart');
const Products=require('../models/products');



router.get('/allcart',userAuth,async (req,res)=>{
    try{
        const loggedinUser=req.user?._id;
        const cartdata=await  Cart.findOne({userId:loggedinUser});
        if(!cartdata){
            res.status(200).json({
                message:"cart is empty"
            })
        };
        res.status(200).json({
            message:"data fetch successfully",
            data:cartdata,
        })
    }catch(err){
        console.error("cart error",err)
        res.status(500).status({
            message:"cart error ",
        })
    }           
});
router.post("/addcart/:id",userAuth,async (req,res)=>{
    try{
        
        const productId=req.params.id;
       
        // const productId=req.body.productId || req.body.item?.[0]?.productId;
        const quantity=req.body.quantity || req.body.item?.[0]?.quantity;
        console.log(productId);
        const loggedinuser=req.user._id;
        
        if(!loggedinuser){
            res.status(404).json({
                message:"loggedin user not found",

            })
        }
        console.log("logged user",loggedinuser)

        const product=await Products.findById(productId);

        console.log("PRODUCTS PRICE  ",product.price)
        console.log("image",product.image)
        if(!product){
           return  res.status(404).json({
                message:"product not found",

            })
        }
        let cart=await Cart.findOne({userId:loggedinuser});
        if(!cart){
            cart=new Cart({
                userId:loggedinuser,
                item:[
                  {
                    productId: product._id,
                    quantity:quantity,
                    price: product.price, 
                    size:product.size,
                    image:product.image,
                    color:product.color,
                    name:product.name,
                    description:product.description
                    // ...(color && { color }),
                    // ...(size && { size }),
                  
                  
                  }
                ]
              
            })
        }
        else
        {
            const existingItemIndex =cart.item.findIndex(item=>
                item.productId.toString()===productId
            )
        
        if (existingItemIndex > -1) {
        cart.item[existingItemIndex].quantity += quantity;
      }
       else 
       {  
        cart.item.push( {
            productId: productId,
            quantity:quantity,
            price: product.price, 
            size:product.size,
            color:product.color,
            image:product.image,
            name:product.name,
            description:product.description
            // ...(color && { color }),
            // ...(size && { size }),
            
          });
      }
    
    }
     const savecart= await cart.save();

    res.status(201).json({
      status: 'success',
      data:savecart,
      
    });

    }
    catch(err){
        console.error("add cart error",err)
        res.status(500).json({
            message:"add to cart error",
            error:err.message,
        })
    }


})
router.delete("/removeitem/:id",userAuth,async(req,res)=>{
    try{
        const itemId=req.params.id;
        const loggedinuser=req.user?._id;
        const cart=await Cart.findOne({userId:loggedinuser});
        if(!cart){
            res.status(404).json({
                message:"cart not found"
            })
        }
        
    const initialItemCount = cart.item.length;

    cart.item = cart.item.filter(item => !item._id.equals(itemId));

    if (cart.item.length === initialItemCount) {
      return res.status(404).json({
        
        message: 'Item not found in cart'
      });
    }

    await cart.save();

    res.status(204).json()

    }catch(err){
        console.error("remove error",err)
        res.status(404).json({
            message:"remove item error",
            Error:err.message

        })
    }
})

module.exports=router;