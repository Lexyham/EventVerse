const r=require('express').Router(),Booking=require('../models/Booking'),{optionalAuth,requireAuth}=require('../lib/auth'),{sendEmail,bookingConfirmHTML}=require('../lib/brevo');
r.post('/',optionalAuth,async(req,res)=>{
  try{
    const b=await Booking.create({...req.body,userId:req.user?.id});
    await sendEmail({to:b.userEmail,toName:b.userName,subject:`🎟️ Booking Confirmed — ${b.eventTitle}`,html:bookingConfirmHTML(b)});
    res.status(201).json(b);
  }catch(err){ res.status(500).json({error:err.message}); }
});
r.get('/my',requireAuth,async(req,res)=>{
  try{ res.json(await Booking.find({userId:req.user.id}).sort({createdAt:-1})); }
  catch(err){ res.status(500).json({error:err.message}); }
});
module.exports=r;
