const r=require('express').Router(),GiftRecord=require('../models/GiftRecord'),{optionalAuth}=require('../lib/auth');
r.post('/',optionalAuth,async(req,res)=>{ try{ const g=await GiftRecord.create({...req.body,userId:req.user?.id}); res.status(201).json(g); }catch(err){ res.status(500).json({error:err.message}); } });
module.exports=r;
