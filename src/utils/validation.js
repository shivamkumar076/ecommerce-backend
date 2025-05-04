const validator = require("validator");
const User = require("../models/user");
const validationsignup = async (req) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName) {
      throw new Error("Please Enter Name");
    } else if (!validator.isEmail(email.trim())) {
      throw new Error("Enter Valid Email");
    } else if (!validator.isStrongPassword(password)) {
      throw new Error("Please Strong PassWord");
    }
  } catch (err) {
    throw new Error("Validation Error");
  }
};
const productvalidation=(req)=>{
  try{
    const {name,category,description,size,color,price}=req.body;
    if(!name || typeof name !=="string" ){
      throw new Error("enter valid name");
    }
    else if(!description || typeof description !=="string" || description.length < 300){
      throw new Error("enter description in 300 words")
    }
    else if(!Array.isArray(size)){
      throw new Error("please enter size");

    }
    else if(!color || typeof color !=="string"){
      throw new Error("enter color")
    }
    else if(!price || typeof size !=="number"){
      throw new Error("enter price")
    }
    const validcategory=["man","woman","kids","electronics"];
    if(!category || ! validcategory.includes(category)){
      throw new Error("enter valid category")
    }
  }catch(err){
   throw new Error("validation error")


}
}
module.exports = {productvalidation,validationsignup};
