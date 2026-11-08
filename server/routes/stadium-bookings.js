const r=require('express').Router(),StadiumBooking=require('../models/StadiumBooking'),{optionalAuth,requireAuth}=require('../lib/auth');
r.post('/',optionalAuth,async(req,res)=>{
  try{ const b=await StadiumBooking.create({...req.body,userId:req.user?.id}); res.status(201).json(b); }
  catch(err){ res.status(500).json({error:err.message}); }
});
r.get('/my',requireAuth,async(req,res)=>{
  try{ res.json(await StadiumBooking.find({userId:req.user.id}).sort({createdAt:-1})); }
  catch(err){ res.status(500).json({error:err.message}); }
});
module.exports=r;
