const mongoose=require('mongoose');
const cartSchema=new mongoose.Schema({
        userId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'user'
        },
        item:[{
            productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Products',
            required:true
            },
            quantity:{
                type:Number,
                required:true,
                min:1,
                default:1
            },
            color:{
                type:String
            },
            size:{    
                type:String
            },
            price:{
                type:Number,
                required:true,
            
            },
            image:{
              type:String,
            },
            name:{
              type:String,
            },
            description:{
              type:String,
            }
          }],
            total:{
                type:Number,
                default:0
            }
},
{
  timestamps:true
});
cartSchema.pre('save', async function(next) {
    try {
      // Calculate total by summing up (price * quantity) for all items
      this.total = this.item.reduce((sum, item) => {
        return sum + (item.price * item.quantity);
      }, 0);
      
      next();
    } catch (error) {
      next(error);
    }
  });
  
module.exports=mongoose.model('Cart',cartSchema);