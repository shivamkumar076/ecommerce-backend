const express=require('express');
const { userAuth } = require('../middleware/userAuth');
const Cart =require("../models/cart");
const Order=require("../models/order")
const router=express.Router();
router.post("/createorder",userAuth,async (req,res)=>{
    try{
        const {shippingAddress, paymentmethod}=req.body;
        const loggedinuser=req.user;
        const cart=await Cart.findOne({user:loggedinuser}).populate('item.product');
        if(!cart || cart.item.length===0){
            return res.status(400).json({
                message:"no cart is found",
            })
        }
        const order = new Order({
            user: req.user._id,
            item: cart.item.map(item => ({
              product: item.product._id,
              quantity: item.quantity,
              price: item.price,
              color: item.color,
              size: item.size,
              
            })),
            total:cart.total,
            shippingAddress,
            paymentmethod
        });
        await order.save();
        await Cart.deleteOne({ user: req.user._id });
    
        res.status(201).json({
            message:"order successfully",
            order
        });

    }catch(err){
        console.error("create order error",err)
    }
})
router.put("/cancel/:id",userAuth,async (req,res)=>{
    try{
        const id=req.params.id;
        const order=await Order.findById(id);
        //valid order exists or not
        if(!order){
            res.status(404).json({
                message:"order not found",

            })

        }
        if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({ 
              success: false,
              message: 'Not authorized to cancel this order' 
            });
          }
        if(order.status==="cancelled"){
            res.status(400).json({
                message:"order already cancelled"
            })
        }
            // Cancel order
    order.status = 'cancelled';
    order.cancelledAt = Date.now();
    await order.save();

    res.status(200).json({ 
      success: true,
      message: 'Order cancelled',
      orderId: order._id,
      newStatus: order.status
    });
      

    }catch(err){
        console.error("cancel error")
    }
})
module.exports=router;