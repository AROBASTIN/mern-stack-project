const mongoose=require("mongoose");

const user=new mongoose.Schema({
    name:String,
    role:String,
    company:String

}); 

module.exports=mongoose.model("profile",user);