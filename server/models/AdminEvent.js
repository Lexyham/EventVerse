const mongoose=require('mongoose');
const s=new mongoose.Schema({title:String,artist:String,category:String,eventDate:String,eventTime:String,venue:String,city:String,state:String,country:String,priceMin:Number,priceMax:Number,currency:{type:String,default:'USD'},description:String,imageUrl:String,ticketsAvailable:Number,isHot:Boolean,isFeatured:Boolean,isTrending:Boolean,isActive:{type:Boolean,default:true}},{timestamps:true});
module.exports=mongoose.model('AdminEvent',s);
