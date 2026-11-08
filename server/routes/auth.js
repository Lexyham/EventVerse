const r=require('express').Router(),User=require('../models/User'),Notification=require('../models/Notification'),{signToken,requireAuth}=require('../lib/auth'),{sendEmail,welcomeHTML}=require('../lib/brevo'),crypto=require('crypto');
r.post('/register',async(req,res)=>{
  const{name,email,password,phone}=req.body;
  if(!name||!email||!password) return res.status(400).json({error:'Name, email and password required'});
  if(password.length<6) return res.status(400).json({error:'Password must be at least 6 characters'});
  try{
    if(await User.findOne({email:email.toLowerCase()})) return res.status(400).json({error:'Email already registered'});
    const user=await User.create({name,email,password,phone:phone||''});
    const token=signToken({id:user._id,email:user.email,role:user.role});
    await Notification.create({userId:user._id.toString(),title:'🎉 Welcome to EventVerse!',message:'Your account is ready! Use code SAVE25 for 25% off your first booking.',fromAdmin:true});
    await sendEmail({to:email,toName:name,subject:'🎉 Welcome to EventVerse!',html:welcomeHTML(name)});
    res.status(201).json({token,user:user.toSafe()});
  }catch(err){ res.status(500).json({error:err.message}); }
});
r.post('/login',async(req,res)=>{
  const{email,password}=req.body;
  if(!email||!password) return res.status(400).json({error:'Email and password required'});
  try{
    const user=await User.findOne({email:email.toLowerCase()});
    if(!user||!(await user.comparePassword(password))) return res.status(401).json({error:'Invalid email or password'});
    const token=signToken({id:user._id,email:user.email,role:user.role});
    res.json({token,user:user.toSafe()});
  }catch(err){ res.status(500).json({error:err.message}); }
});
r.post('/forgot-password',async(req,res)=>{
  const{email}=req.body;
  if(!email) return res.status(400).json({error:'Email required'});
  try{
    const user=await User.findOne({email:email.toLowerCase()});
    if(!user) return res.json({message:'If that email exists, a reset link has been sent.'});
    const token=crypto.randomBytes(32).toString('hex');
    user.resetToken=token; user.resetTokenExpiry=new Date(Date.now()+3600000);
    await user.save();
    res.json({message:'Reset link sent if account exists.'});
  }catch(err){ res.status(500).json({error:err.message}); }
});
r.get('/me',requireAuth,async(req,res)=>{
  try{ const user=await User.findById(req.user.id); if(!user) return res.status(404).json({error:'Not found'}); res.json(user.toSafe()); }
  catch(err){ res.status(500).json({error:err.message}); }
});
module.exports=r;
