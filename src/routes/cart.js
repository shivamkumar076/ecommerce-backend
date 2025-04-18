const express=require('express');
const router=express.Router();
const {userAuth}=require('../middleware/userAuth');
const Cart = require('../models/cart');
const Products=require('../models/products');



router.get('/cart',userAuth,async (req,res)=>{
    try{
        const loggedinUser=req.user;
        const cartdata=await  Cart.findById({userId:loggedinUser}).populate("item.product")
        if(!cartdata){
            res.status(200).json({
                message:"cart is empty"
            })
        };
        res.status(200).status({
            message:"data fetch successfully",
            Cart,
        })


    }catch(err){
        console.error("cart error",err)
        res.status(500).status({
            message:"cart error ",
        })
    }           
})
router.post("/addcart",userAuth,async(req,res)=>{
    try{
        const {productId,color,size,quantity}=req.body;
        const loggedinuser=req.user;
        const product=await Products.findById(productId);
        if(!product){
            res.status(404).json({
                message:"product not found",

            })
        }
        const cart=await Cart.findById({userId:loggedinuser});
        if(!cart){
            cart=new Cart({
                userid:loggedinuser,
                item:[
                  {
                    product: productId,
                    quantity,
                    price: product.price, 
                    ...(color && { color }),
                    ...(size && { size })
                  }
                ]
              
            })
        }else{
            const existingitem=cart.item.findIndex(item=>{
                itme.product.toString()===productId
            })
        }
        if (existingItemIndex > -1) {
        cart.item[existingItemIndex].quantity += quantity;
      }
       else 
       {  
        cart.item.push( {
            product: productId,
            quantity,
            price: product.price, 
            ...(color && { color }),
            ...(size && { size })
          });
      }
      await Cart.save();

    res.status(200).json({
      status: 'success',
      data: {
        cart
      }
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
router.delete("/remove/:id",userAuth,async(req,res)=>{
    try{
        const {itemId}=req.params.id;
        const loggedinuser=req.user;
        const cart=await Cart.findById({userId:loggedinuser});
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