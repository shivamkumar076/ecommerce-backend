const express=require('express');
const { userAuth } = require('../middleware/userAuth');
const Cart =require("../models/cart");
const Order=require("../models/order");

const router=express.Router();
router.post("/createorder",userAuth,async (req,res)=>{
    try{
        const {shippingAddress, paymentmethod}=req.body;
        if(!shippingAddress){
            return res.status(400).json({
                message:"please enter address",
            })
        }
      
        const loggedinuser=req.user?._id;
        const cart=await Cart.findOne({userId:loggedinuser})
        if(!cart || cart.item.length===0){
            return res.status(400).json({
                message:"no cart is found",
            })
        }
       
      
        const order = new Order({
            userId: req.user?._id,
            item: cart.item.map(item => ({
            productId: item.productId,
              quantity: item.quantity,
              price: item.price,
              color: item?.color,
              size: item?.size,
              image:item?.image,
              name:item?.name,
              description:item?.description
              
            })),
            total:cart.total,
            shippingAddress,
            paymentmethod
        });
        await order.save();
        await Cart.deleteOne({ userId: loggedinuser });

    
        res.status(201).json({
            message:"order successfully",
            data:order
        });

    }catch(err){
        console.error("create order error",err)
    }
})
router.get('/order',userAuth,async(req,res)=>{
    try{
        const id=req.user?.id;
        const order=await Order.findOne({userId:id})
        console.log(order);
        if(!order){
            res.status(200).json({
                message:"order not found"
            })
        };
        res.status(200).json({
            message:"order get successfully",
            data:order
        })

    }catch(err){
        console.err("order get error");
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
        if (order.userId.toString() !== req.user?._id.toString() && !req.user?.isAdmin) {
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