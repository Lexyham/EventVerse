const mongoose=require('mongoose'),bcrypt=require('bcryptjs');
const s=new mongoose.Schema({name:{type:String,required:true,trim:true},email:{type:String,required:true,unique:true,lowercase:true,trim:true},password:{type:String,required:true,minlength:6},phone:{type:String,default:''},role:{type:String,enum:['user','admin'],default:'user'},resetToken:String,resetTokenExpiry:Date},{timestamps:true});
s.pre('save',async function(next){ if(!this.isModified('password')) return next(); this.password=await bcrypt.hash(this.password,12); next(); });
s.methods.comparePassword=function(p){ return bcrypt.compare(p,this.password); };
s.methods.toSafe=function(){ const o=this.toObject(); delete o.password; delete o.resetToken; delete o.resetTokenExpiry; return o; };
module.exports=mongoose.model('User',s);
