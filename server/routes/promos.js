const r=require('express').Router(),PromoCode=require('../models/PromoCode');
r.post('/validate',async(req,res)=>{
  const{code}=req.body;
  if(!code) return res.status(400).json({error:'Code required'});
  try{
    const p=await PromoCode.findOne({code:code.toUpperCase(),isActive:true});
    if(!p) return res.status(404).json({error:'Invalid or expired promo code'});
    if(p.usageLimit&&p.usageCount>=p.usageLimit) return res.status(400).json({error:'Usage limit reached'});
    if(p.expiresAt&&new Date(p.expiresAt)<new Date()) return res.status(400).json({error:'Code expired'});
    res.json({valid:true,code:p.code,discount:p.discount});
  }catch(err){ res.status(500).json({error:err.message}); }
});
r.post('/use',async(req,res)=>{
  const{code}=req.body;
  await PromoCode.findOneAndUpdate({code:code?.toUpperCase()},{$inc:{usageCount:1}});
  res.json({success:true});
});
module.exports=r;
