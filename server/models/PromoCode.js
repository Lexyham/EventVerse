const mongoose=require('mongoose');
const s=new mongoose.Schema({code:{type:String,required:true,unique:true,uppercase:true},discount:{type:Number,required:true,min:1,max:100},isActive:{type:Boolean,default:true},usageLimit:Number,usageCount:{type:Number,default:0},expiresAt:Date},{timestamps:true});
module.exports=mongoose.model('PromoCode',s);
