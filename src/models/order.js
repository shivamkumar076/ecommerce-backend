const mongoose=require('mongoose');

const orderSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:true,
    },
    item:[
        {
            Products:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'products',
                required:true
            },
            quantity:{
                type:Number,
                required:true,
            },
            price:{
                type:Number,
                required:true,

            },
            color:{
                type:String,
            },
            size:{
                type:String
            },
          

        }
    ],
    total:{
        type:String

    },
    shippingAddress:{
        type:String,
        maxLength:30, 
        required:true
    },
    paymentmethod:{
        type:String,
        required:true

    },
    status: {
        type: String,
        enum: ['processing','cancelled'],
        default: 'processing'
      },
      cancelledAt: Date
},{
    timestamps:true
})

module.exports=mongoose.model("Order",orderSchema);