const mongoose=require('mongoose');
const s=new mongoose.Schema({name:String,artist:String,category:String,price:Number,currency:{type:String,default:'USD'},imageUrl:String,description:String,inStock:{type:Boolean,default:true},stockCount:Number,badge:String,rating:{type:Number,default:4.5},reviewCount:{type:Number,default:0}},{timestamps:true});
module.exports=mongoose.model('Product',s);
