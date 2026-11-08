const r=require('express').Router();
const {requireAdmin}=require('../lib/auth');
const Booking=require('../models/Booking');
const StadiumBooking=require('../models/StadiumBooking');
const MerchOrder=require('../models/MerchOrder');
const GiftRecord=require('../models/GiftRecord');
const PromoCode=require('../models/PromoCode');
const Notification=require('../models/Notification');
const AdminEvent=require('../models/AdminEvent');
const AdminMatch=require('../models/AdminMatch');
const Product=require('../models/Product');

r.use(requireAdmin);

r.get('/stats',async(req,res)=>{
  try{
    const[bTotal,sbTotal,moTotal,grTotal,pending]=await Promise.all([Booking.countDocuments(),StadiumBooking.countDocuments(),MerchOrder.countDocuments(),GiftRecord.countDocuments(),Booking.countDocuments({paymentStatus:'pending'})]);
    const rev=(await Booking.find({paymentStatus:'approved'})).reduce((s,b)=>s+(b.total||0),0);
    res.json({totalBookings:bTotal,totalStadiumBookings:sbTotal,totalMerchOrders:moTotal,totalGifts:grTotal,pendingApprovals:pending,totalRevenue:rev});
  }catch(err){ res.status(500).json({error:err.message}); }
});

r.get('/events',async(req,res)=>{ try{ res.json(await AdminEvent.find().sort({createdAt:-1})); }catch(err){ res.status(500).json({error:err.message}); } });
r.post('/events',async(req,res)=>{ try{ res.status(201).json(await AdminEvent.create(req.body)); }catch(err){ res.status(500).json({error:err.message}); } });
r.put('/events/:id',async(req,res)=>{ try{ res.json(await AdminEvent.findByIdAndUpdate(req.params.id,req.body,{new:true})); }catch(err){ res.status(500).json({error:err.message}); } });
r.delete('/events/:id',async(req,res)=>{ try{ await AdminEvent.findByIdAndDelete(req.params.id); res.json({success:true}); }catch(err){ res.status(500).json({error:err.message}); } });

r.get('/matches',async(req,res)=>{ try{ res.json(await AdminMatch.find().sort({createdAt:-1})); }catch(err){ res.status(500).json({error:err.message}); } });
r.post('/matches',async(req,res)=>{ try{ res.status(201).json(await AdminMatch.create(req.body)); }catch(err){ res.status(500).json({error:err.message}); } });
r.put('/matches/:id',async(req,res)=>{ try{ res.json(await AdminMatch.findByIdAndUpdate(req.params.id,req.body,{new:true})); }catch(err){ res.status(500).json({error:err.message}); } });
r.delete('/matches/:id',async(req,res)=>{ try{ await AdminMatch.findByIdAndDelete(req.params.id); res.json({success:true}); }catch(err){ res.status(500).json({error:err.message}); } });

r.get('/products',async(req,res)=>{ try{ res.json(await Product.find().sort({createdAt:-1})); }catch(err){ res.status(500).json({error:err.message}); } });
r.post('/products',async(req,res)=>{ try{ res.status(201).json(await Product.create(req.body)); }catch(err){ res.status(500).json({error:err.message}); } });
r.put('/products/:id',async(req,res)=>{ try{ res.json(await Product.findByIdAndUpdate(req.params.id,req.body,{new:true})); }catch(err){ res.status(500).json({error:err.message}); } });
r.delete('/products/:id',async(req,res)=>{ try{ await Product.findByIdAndDelete(req.params.id); res.json({success:true}); }catch(err){ res.status(500).json({error:err.message}); } });

r.get('/bookings',async(req,res)=>{ try{ res.json(await Booking.find().sort({createdAt:-1})); }catch(err){ res.status(500).json({error:err.message}); } });
r.patch('/bookings/:id/status',async(req,res)=>{
  try{
    const b=await Booking.findByIdAndUpdate(req.params.id,{paymentStatus:req.body.status},{new:true});
    if(!b) return res.status(404).json({error:'Not found'});
    if(b.userId) await Notification.create({userId:b.userId.toString(),title:req.body.status==='approved'?'✅ Booking Approved!':'❌ Booking Rejected',message:req.body.status==='approved'?`Your booking for "${b.eventTitle}" has been approved!`:`Your booking for "${b.eventTitle}" was rejected.`,fromAdmin:true});
    res.json(b);
  }catch(err){ res.status(500).json({error:err.message}); }
});

r.get('/stadium-bookings',async(req,res)=>{ try{ res.json(await StadiumBooking.find().sort({createdAt:-1})); }catch(err){ res.status(500).json({error:err.message}); } });
r.patch('/stadium-bookings/:id/status',async(req,res)=>{
  try{
    const b=await StadiumBooking.findByIdAndUpdate(req.params.id,{paymentStatus:req.body.status},{new:true});
    if(b?.userId) await Notification.create({userId:b.userId.toString(),title:req.body.status==='approved'?'✅ Stadium Ticket Approved!':'❌ Stadium Booking Rejected',message:req.body.status==='approved'?`Your ticket for "${b.matchName}" has been approved!`:`Your stadium booking was rejected.`,fromAdmin:true});
    res.json(b);
  }catch(err){ res.status(500).json({error:err.message}); }
});

r.get('/merch-orders',async(req,res)=>{ try{ res.json(await MerchOrder.find().sort({createdAt:-1})); }catch(err){ res.status(500).json({error:err.message}); } });
r.patch('/merch-orders/:id/status',async(req,res)=>{
  try{
    const o=await MerchOrder.findByIdAndUpdate(req.params.id,{paymentStatus:req.body.status},{new:true});
    if(o?.userId) await Notification.create({userId:o.userId.toString(),title:req.body.status==='approved'?'✅ Order Confirmed!':'❌ Order Rejected',message:req.body.status==='approved'?`Your merch order #${o.orderRef} is confirmed!`:`Your order #${o.orderRef} was rejected.`,fromAdmin:true});
    res.json(o);
  }catch(err){ res.status(500).json({error:err.message}); }
});

r.get('/gifts',async(req,res)=>{ try{ res.json(await GiftRecord.find().sort({createdAt:-1})); }catch(err){ res.status(500).json({error:err.message}); } });
r.patch('/gifts/:id/status',async(req,res)=>{
  try{
    const g=await GiftRecord.findByIdAndUpdate(req.params.id,{status:req.body.status},{new:true});
    if(g?.userId) await Notification.create({userId:g.userId.toString(),title:req.body.status==='approved'?'💜 Gift Delivered!':'❌ Gift Not Processed',message:req.body.status==='approved'?`Your $${g.amount} gift to ${g.recipientName} was confirmed!`:`Your gift to ${g.recipientName} could not be processed.`,fromAdmin:true});
    res.json(g);
  }catch(err){ res.status(500).json({error:err.message}); }
});

r.get('/promos',async(req,res)=>{ try{ res.json(await PromoCode.find().sort({createdAt:-1})); }catch(err){ res.status(500).json({error:err.message}); } });
r.post('/promos',async(req,res)=>{ try{ res.status(201).json(await PromoCode.create(req.body)); }catch(err){ res.status(500).json({error:err.message}); } });
r.patch('/promos/:id',async(req,res)=>{ try{ res.json(await PromoCode.findByIdAndUpdate(req.params.id,req.body,{new:true})); }catch(err){ res.status(500).json({error:err.message}); } });
r.delete('/promos/:id',async(req,res)=>{ try{ await PromoCode.findByIdAndDelete(req.params.id); res.json({success:true}); }catch(err){ res.status(500).json({error:err.message}); } });

r.get('/notifications',async(req,res)=>{ try{ res.json(await Notification.find().sort({createdAt:-1}).limit(100)); }catch(err){ res.status(500).json({error:err.message}); } });
r.post('/notifications/broadcast',async(req,res)=>{ try{ res.status(201).json(await Notification.create({userId:'ALL',title:req.body.title,message:req.body.message,fromAdmin:true})); }catch(err){ res.status(500).json({error:err.message}); } });
r.post('/notifications/reply',async(req,res)=>{ try{ res.json(await Notification.findByIdAndUpdate(req.body.notification_id,{reply:req.body.reply,replyAt:new Date()},{new:true})); }catch(err){ res.status(500).json({error:err.message}); } });

module.exports=r;
