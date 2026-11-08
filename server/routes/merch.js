const r=require('express').Router(),Product=require('../models/Product'),MerchOrder=require('../models/MerchOrder'),{optionalAuth,requireAuth}=require('../lib/auth');
r.get('/products',async(req,res)=>{ try{ res.json(await Product.find().sort({createdAt:-1})); }catch(err){ res.status(500).json({error:err.message}); } });
r.post('/orders',optionalAuth,async(req,res)=>{ try{ const o=await MerchOrder.create({...req.body,userId:req.user?.id}); res.status(201).json(o); }catch(err){ res.status(500).json({error:err.message}); } });
r.get('/orders/my',requireAuth,async(req,res)=>{ try{ res.json(await MerchOrder.find({userId:req.user.id}).sort({createdAt:-1})); }catch(err){ res.status(500).json({error:err.message}); } });
module.exports=r;
