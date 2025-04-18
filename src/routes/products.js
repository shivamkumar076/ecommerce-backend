const Products = require("../models/products");
const { userAuth, isAdminAuth } = require("../middleware/userAuth");
const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const { productvaidation } = require("../utils/validation");
const { error } = require("console");


// @route post--/addproduct
// @desc  create product

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

// filter file
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("only image  are allowed"), false);
  }
};
const upload = multer({
  storage,
  fileFilter,
  limits: {
    //to limit 2 mb size to avoid large size
    fileSize: 2 * 1024 * 1024,
  },
});

router.post(
  "/addproduct",
  userAuth,
  isAdminAuth,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, category, description, size, price } = req.body;
      const image = req.file?.path;
      //create a product instance

      const product = new Products({
        name,
        category,
        description,
        size,
        price,
        image,
      });
      await product.save();
      res.status(200).json({
        message: "product add successfully",
        product: product,
      });
    } catch (err) {
      console.error("add product error", err);
      res.status(500).json({
        message: "add product error",
        Error: err.message,
      });
    }
  }
);
router.patch("/product/:id",userAuth,isAdminAuth, upload.single('image'), async (req,res)=>{
    try{
        productvaidation(req.body);
        const {name,description,size,color,price,category}=req.body;
        const image = req.file?.path;
        const id=req.params.id;
        updatedata={
            name,
            description,
            size,
            color,
            price,
            category
        }
        if(image) updatedata.image=image
        const product=new Products.findByIdAndUpdate(id,updatedata);
        if(!product){
            return res.status(500).json({
                message:"product not available"
            })
        }
        res.status(200).json({
            message:"product update successfully",
            product:product,
        })
        
      

    }catch(err){
        res.status(500).json({
            message:"update error",
            error:err.message,
        })
    }

});
router.get('/product',async (req,res)=>{
    try{
      let page=parseInt(req.query.page) || 1;
      let limit=parseInt(req.query.limit) || 10;
      let skip=(page-1)*limit;

        const product=await Products.find({})
        .skip(skip)
        .limit(limit)
        .lean();
        if(!product){
            res.status(401).status({
                message:"product not found"
            })
        };
        res.status(200).json({
            message:"get all product successfully",
            product
        });

    }catch(err){
        console.error("get all product error",err)
        res.status(500).json({
            message:"get all product error",
            error:err.message,
        })
    }
});
router.get("/product/:id",async (req,res)=>{
  try{
    const id=req.params.id;
    const product=await Products.findById({_id:id});
    if(!product){
      throw new Error("product not found");
    };
    res.status(200).json({
      message:"product get successfull",
      product

    })


  }catch(err){
    console.error("product get by id error",err);
    res.status(500).json({
      message:"get all product by id error",
      error:err.message
    })
  }
});
router.delete("/product/:id",userAuth,isAdminAuth,async(req,res)=>{
  try{
    const id=req.params.id;
    const product=await Products.findByIdAndDelete({_id:id});
    if(!product){
      throw new Error("product not found for delete");
    }
    res.status(200).json({
      message:"product delete successfully"
    })

  }catch(err){
    console.error("delete Error ",err)
    res.status(500).json({
      message:"delete error ",
      error:err.message
      
    })
  }
})


module.exports = router;
