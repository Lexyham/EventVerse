const mongoose=require('mongoose');
const s=new mongoose.Schema({stadiumName:String,matchName:String,homeTeam:String,awayTeam:String,competition:String,city:String,country:String,matchDate:String,matchTime:String,capacity:Number,availableSeats:Number,imageUrl:String,ticketVip:Number,ticketPremium:Number,ticketRegular:Number,ticketEconomy:Number,currency:{type:String,default:'USD'},ticketSalesEnabled:{type:Boolean,default:true}},{timestamps:true});
module.exports=mongoose.model('AdminMatch',s);
