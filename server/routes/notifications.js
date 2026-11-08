const r=require('express').Router(),Notification=require('../models/Notification'),{requireAuth}=require('../lib/auth');
r.get('/',requireAuth,async(req,res)=>{
  try{ res.json(await Notification.find({$or:[{userId:req.user.id},{userId:'ALL'}]}).sort({createdAt:-1}).limit(30)); }
  catch(err){ res.status(500).json({error:err.message}); }
});
r.patch('/:id/read',requireAuth,async(req,res)=>{
  try{ await Notification.findByIdAndUpdate(req.params.id,{isRead:true}); res.json({success:true}); }
  catch(err){ res.status(500).json({error:err.message}); }
});
r.post('/',async(req,res)=>{ try{ res.status(201).json(await Notification.create(req.body)); }catch(err){ res.status(500).json({error:err.message}); } });
module.exports=r;
