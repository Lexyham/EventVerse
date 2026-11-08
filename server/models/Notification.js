const mongoose=require('mongoose');
const s=new mongoose.Schema({userId:{type:String,required:true},title:{type:String,required:true},message:{type:String,required:true},isRead:{type:Boolean,default:false},fromAdmin:{type:Boolean,default:false},reply:String,replyAt:Date},{timestamps:true});
module.exports=mongoose.model('Notification',s);
