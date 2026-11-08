/* EventVerse — store.js — localStorage state management */
'use strict';
const STORE_KEY = 'eventverse-v4';
const API_BASE = window.EV_API_BASE || '/api';

const DEFAULT_STATE = {
  cart: [], merchCart: [], favorites: [],
  user: null, isAuthenticated: false, isAdminAuthenticated: false, adminKey: null,
  bookings: [], stadiumBookings: [], merchOrders: [], giftRecords: [],
  notifications: [{ id:'welcome-001', userId:'ALL', title:'🎉 Welcome to EventVerse!', message:'Thank you for joining! Browse 200+ events worldwide. Use code SAVE25 for 25% off your first booking!', isRead:false, fromAdmin:true, createdAt:new Date().toISOString() }],
  promoCodes: [
    {id:'p1',code:'FULL100',discount:100,isActive:true,usageCount:0},
    {id:'p2',code:'HALF50', discount:50, isActive:true,usageCount:0},
    {id:'p3',code:'SAVE25', discount:25, isActive:true,usageCount:0},
    {id:'p4',code:'VIP10',  discount:10, isActive:true,usageCount:0},
  ],
  adminEvents: [], adminMatches: [], adminProducts: [],
};

function getState(){ try{ const s=localStorage.getItem(STORE_KEY); return s?{...DEFAULT_STATE,...JSON.parse(s)}:{...DEFAULT_STATE}; }catch{ return {...DEFAULT_STATE}; } }
function setState(u){ const cur=getState(); const next={...cur,...u}; try{localStorage.setItem(STORE_KEY,JSON.stringify(next));}catch{} window.dispatchEvent(new CustomEvent('ev-state-change',{detail:next})); return next; }

async function apiFetch(path, opts={}){
  const token = localStorage.getItem('ev_token');
  const res = await fetch(API_BASE+path, { ...opts, headers:{'Content-Type':'application/json', ...(token?{Authorization:`Bearer ${token}`}:{}), ...(opts.headers||{})} });
  if(!res.ok){ const e=await res.json().catch(()=>({error:`HTTP ${res.status}`})); throw new Error(e.error||`HTTP ${res.status}`); }
  return res.json();
}
async function adminFetch(path, opts={}){
  const s=getState(); const key=s.adminKey||'eventverse_admin_secret_2026';
  return apiFetch(path, {...opts, headers:{...(opts.headers||{}),'x-admin-key':key}});
}

const store = {
  getState,

  async register(name,email,password,phone){
    try{
      const data=await apiFetch('/auth/register',{method:'POST',body:JSON.stringify({name,email,password,phone})});
      const user={...data.user,token:data.token}; setState({user,isAuthenticated:true}); localStorage.setItem('ev_token',data.token);
      return data;
    }catch(err){
      const user={id:'local-'+Date.now(),name,email,phone:phone||''};
      setState({user,isAuthenticated:true});
      store.addNotification({id:'welcome-'+Date.now(),userId:user.id,title:'🎉 Welcome to EventVerse!',message:`Hi ${name}! Use code SAVE25 for 25% off your first booking!`,isRead:false,fromAdmin:true,createdAt:new Date().toISOString()});
      return {user};
    }
  },
  async login(email,password){
    try{
      const data=await apiFetch('/auth/login',{method:'POST',body:JSON.stringify({email,password})});
      const user={...data.user,token:data.token}; setState({user,isAuthenticated:true}); localStorage.setItem('ev_token',data.token);
      return data;
    }catch(err){
      const user={id:'local-'+Date.now(),name:email.split('@')[0],email};
      setState({user,isAuthenticated:true});
      return {user};
    }
  },
  logout(){ setState({user:null,isAuthenticated:false,isAdminAuthenticated:false,adminKey:null}); localStorage.removeItem('ev_token'); },

  async adminLogin(username,password){
    try{
      const res=await fetch(API_BASE+'/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})});
      const json=await res.json();
      if(json.success){ setState({isAdminAuthenticated:true,adminKey:json.adminKey}); return true; }
    }catch{}
    if(username==='admin'&&password==='admin123'){ setState({isAdminAuthenticated:true,adminKey:'eventverse_admin_secret_2026'}); return true; }
    return false;
  },
  adminLogout(){ setState({isAdminAuthenticated:false,adminKey:null}); },

  addToCart(item){ const s=getState(); const ex=s.cart.find(i=>i.id===item.id); if(ex) setState({cart:s.cart.map(i=>i.id===item.id?{...i,quantity:i.quantity+item.quantity}:i)}); else setState({cart:[...s.cart,item]}); },
  removeFromCart(id){ setState({cart:getState().cart.filter(i=>i.id!==id)}); },
  updateCartQty(id,qty){ if(qty<=0){store.removeFromCart(id);return;} setState({cart:getState().cart.map(i=>i.id===id?{...i,quantity:qty}:i)}); },
  clearCart(){ setState({cart:[]}); },
  getCartTotal(){ return getState().cart.reduce((t,i)=>t+i.price*i.quantity,0); },
  getCartCount(){ return getState().cart.reduce((c,i)=>c+i.quantity,0); },

  addToMerchCart(item){ const s=getState(); const ex=s.merchCart.find(i=>i.id===item.id); if(ex) setState({merchCart:s.merchCart.map(i=>i.id===item.id?{...i,quantity:i.quantity+1}:i)}); else setState({merchCart:[...s.merchCart,{...item,quantity:1}]}); },
  removeFromMerchCart(id){ setState({merchCart:getState().merchCart.filter(i=>i.id!==id)}); },
  updateMerchQty(id,qty){ if(qty<=0){store.removeFromMerchCart(id);return;} setState({merchCart:getState().merchCart.map(i=>i.id===id?{...i,quantity:qty}:i)}); },
  clearMerchCart(){ setState({merchCart:[]}); },
  getMerchTotal(){ return getState().merchCart.reduce((t,i)=>t+i.price*i.quantity,0); },

  toggleFavorite(id){ const s=getState(); setState({favorites:s.favorites.includes(id)?s.favorites.filter(x=>x!==id):[...s.favorites,id]}); },
  isFavorite(id){ return getState().favorites.includes(id); },

  async validatePromoCode(code){
    try{ const res=await apiFetch('/promos/validate',{method:'POST',body:JSON.stringify({code})}); if(res.valid) return res; }catch{}
    const s=getState(); const p=s.promoCodes.find(p=>p.code.toUpperCase()===code.toUpperCase()&&p.isActive);
    if(!p) return null; if(p.usageLimit&&p.usageCount>=p.usageLimit) return null; return p;
  },

  async addBooking(b){ setState({bookings:[...getState().bookings,b]}); try{await apiFetch('/bookings',{method:'POST',body:JSON.stringify(b)});}catch{} },
  updateBookingStatus(id,status){
    setState({bookings:getState().bookings.map(b=>b.id===id?{...b,paymentStatus:status}:b)});
    const b=getState().bookings.find(x=>x.id===id);
    if(b) store.addNotification({id:'notif-'+Date.now(),userId:b.userId||'ALL',title:status==='approved'?'✅ Booking Approved!':'❌ Booking Rejected',message:status==='approved'?`Your booking for "${b.eventTitle}" has been approved!`:`Your booking for "${b.eventTitle}" was rejected.`,isRead:false,fromAdmin:true,createdAt:new Date().toISOString()});
  },

  async addStadiumBooking(b){ setState({stadiumBookings:[...getState().stadiumBookings,b]}); try{await apiFetch('/stadium-bookings',{method:'POST',body:JSON.stringify(b)});}catch{} },
  updateStadiumStatus(id,status){ setState({stadiumBookings:getState().stadiumBookings.map(b=>b.id===id?{...b,paymentStatus:status}:b)}); },

  async addMerchOrder(o){ setState({merchOrders:[...getState().merchOrders,o]}); try{await apiFetch('/merch/orders',{method:'POST',body:JSON.stringify(o)});}catch{} },
  updateMerchOrderStatus(id,status){ setState({merchOrders:getState().merchOrders.map(o=>o.id===id?{...o,paymentStatus:status}:o)}); },

  async addGiftRecord(g){ setState({giftRecords:[...getState().giftRecords,g]}); try{await apiFetch('/gifts',{method:'POST',body:JSON.stringify(g)});}catch{} },
  updateGiftStatus(id,status){ setState({giftRecords:getState().giftRecords.map(g=>g.id===id?{...g,status}:g)}); },

  addNotification(n){ const s=getState(); if(s.notifications.find(x=>x.id===n.id)) return; setState({notifications:[...s.notifications,n]}); },
  markNotificationRead(id){ setState({notifications:getState().notifications.map(n=>n.id===id?{...n,isRead:true}:n)}); try{apiFetch(`/notifications/${id}/read`,{method:'PATCH'});}catch{} },
  addAdminReply(notifId,reply){ setState({notifications:getState().notifications.map(n=>n.id===notifId?{...n,reply,replyAt:new Date().toISOString(),isRead:false}:n)}); },
  getUnreadCount(userId){ return getState().notifications.filter(n=>(n.userId===userId||n.userId==='ALL')&&!n.isRead).length; },

  addAdminEvent(e){ setState({adminEvents:[...getState().adminEvents.filter(x=>x.id!==e.id),e]}); },
  updateAdminEvent(id,u){ setState({adminEvents:getState().adminEvents.map(e=>e.id===id?{...e,...u}:e)}); },
  deleteAdminEvent(id){ setState({adminEvents:getState().adminEvents.filter(e=>e.id!==id)}); },

  addAdminMatch(m){ setState({adminMatches:[...getState().adminMatches.filter(x=>x.id!==m.id),m]}); },
  updateAdminMatch(id,u){ setState({adminMatches:getState().adminMatches.map(m=>m.id===id?{...m,...u}:m)}); },
  deleteAdminMatch(id){ setState({adminMatches:getState().adminMatches.filter(m=>m.id!==id)}); },

  addAdminProduct(p){ setState({adminProducts:[...getState().adminProducts.filter(x=>x.id!==p.id),p]}); },
  updateAdminProduct(id,u){ setState({adminProducts:getState().adminProducts.map(p=>p.id===id?{...p,...u}:p)}); },
  deleteAdminProduct(id){ setState({adminProducts:getState().adminProducts.filter(p=>p.id!==id)}); },

  addPromoCode(p){ setState({promoCodes:[...getState().promoCodes,p]}); },
  updatePromoCode(id,u){ setState({promoCodes:getState().promoCodes.map(p=>p.id===id?{...p,...u}:p)}); },
  deletePromoCode(id){ setState({promoCodes:getState().promoCodes.filter(p=>p.id!==id)}); },

  async loadAdminData(){
    const [events,matches,products,bookings,stadiumBookings,orders,gifts,promos,notifs] = await Promise.allSettled([
      adminFetch('/admin/events'), adminFetch('/admin/matches'), adminFetch('/admin/products'),
      adminFetch('/admin/bookings'), adminFetch('/admin/stadium-bookings'), adminFetch('/admin/merch-orders'),
      adminFetch('/admin/gifts'), adminFetch('/admin/promos'), adminFetch('/admin/notifications'),
    ]);
    if(events.status==='fulfilled') events.value.forEach(e=>store.addAdminEvent({id:e._id,title:e.title,artist:e.artist,category:e.category,date:e.eventDate,time:e.eventTime,venue:e.venue,city:e.city,state:e.state||'',country:e.country,price:{min:e.priceMin,max:e.priceMax,currency:e.currency||'USD'},description:e.description,image:e.imageUrl,ticketsAvailable:e.ticketsAvailable,hot:e.isHot,featured:e.isFeatured,trending:e.isTrending}));
    if(matches.status==='fulfilled') matches.value.forEach(m=>store.addAdminMatch({id:m._id,stadiumName:m.stadiumName,matchName:m.matchName,homeTeam:m.homeTeam,awayTeam:m.awayTeam,competition:m.competition,city:m.city,country:m.country,date:m.matchDate,time:m.matchTime,capacity:m.capacity,availableSeats:m.availableSeats,image:m.imageUrl,tickets:{vip:m.ticketVip,premium:m.ticketPremium,regular:m.ticketRegular,economy:m.ticketEconomy,currency:m.currency||'USD'},ticketSalesEnabled:m.ticketSalesEnabled}));
    if(products.status==='fulfilled') products.value.forEach(p=>store.addAdminProduct({id:p._id,name:p.name,artist:p.artist,category:p.category,price:p.price,currency:p.currency||'USD',image:p.imageUrl,description:p.description,inStock:p.inStock,stockCount:p.stockCount,badge:p.badge,rating:p.rating,reviewCount:p.reviewCount}));
    if(bookings.status==='fulfilled') setState({bookings:bookings.value.map(b=>({id:b._id,userId:b.userId,userName:b.userName,userEmail:b.userEmail,eventId:b.eventId,eventTitle:b.eventTitle,eventDate:b.eventDate,eventVenue:b.eventVenue,ticketType:b.ticketType,quantity:b.quantity,price:b.price,total:b.total,paymentMethod:b.paymentMethod,paymentStatus:b.paymentStatus,ticketCode:b.ticketCode,bookedAt:b.createdAt,cardNumber:b.cardNumber,cardName:b.cardName,cardExpiry:b.cardExpiry,cardCvv:b.cardCvv,cryptoCoin:b.cryptoCoin,cryptoTxId:b.cryptoTxId,giftcardType:b.giftcardType,giftcardCode:b.giftcardCode,hotelName:b.hotelName,hotelNights:b.hotelNights}))});
    if(stadiumBookings.status==='fulfilled') setState({stadiumBookings:stadiumBookings.value.map(b=>({id:b._id,matchId:b.matchId,matchName:b.matchName,stadiumName:b.stadiumName,matchDate:b.matchDate,matchTime:b.matchTime,userId:b.userId,userName:b.userName,userEmail:b.userEmail,userPhone:b.userPhone,seatCategory:b.seatCategory,quantity:b.quantity,pricePerTicket:b.pricePerTicket,total:b.total,currency:b.currency,paymentMethod:b.paymentMethod,paymentStatus:b.paymentStatus,ticketCode:b.ticketCode,bookedAt:b.createdAt}))});
    if(orders.status==='fulfilled') setState({merchOrders:orders.value.map(o=>({id:o._id,userId:o.userId,userName:o.userName,userEmail:o.userEmail,items:o.items,total:o.total,paymentMethod:o.paymentMethod,paymentStatus:o.paymentStatus,orderRef:o.orderRef,orderedAt:o.createdAt}))});
    if(gifts.status==='fulfilled') setState({giftRecords:gifts.value.map(g=>({id:g._id,userId:g.userId,userName:g.userName,userEmail:g.userEmail,recipientName:g.recipientName,amount:g.amount,message:g.message,paymentMethod:g.paymentMethod,giftcardType:g.giftcardType,giftcardCode:g.giftcardCode,cryptoCoin:g.cryptoCoin,cryptoTxId:g.cryptoTxId,status:g.status,ref:g.ref,createdAt:g.createdAt}))});
    if(promos.status==='fulfilled') setState({promoCodes:promos.value.map(p=>({id:p._id,code:p.code,discount:p.discount,isActive:p.isActive,usageLimit:p.usageLimit,usageCount:p.usageCount}))});
    if(notifs.status==='fulfilled') notifs.value.forEach(n=>store.addNotification({id:n._id,userId:n.userId,title:n.title,message:n.message,isRead:n.isRead,fromAdmin:n.fromAdmin,reply:n.reply,replyAt:n.replyAt,createdAt:n.createdAt}));
  },

  async adminUpdateStatus(type,id,status){
    const map={booking:'/admin/bookings',stadium:'/admin/stadium-bookings',merch:'/admin/merch-orders',gift:'/admin/gifts'};
    try{ await adminFetch(`${map[type]}/${id}/status`,{method:'PATCH',body:JSON.stringify({status})}); }catch{}
    if(type==='booking') store.updateBookingStatus(id,status);
    else if(type==='stadium') store.updateStadiumStatus(id,status);
    else if(type==='merch') store.updateMerchOrderStatus(id,status);
    else if(type==='gift') store.updateGiftStatus(id,status);
  },
  async adminSaveEvent(e,id){ try{ const url=id?`/admin/events/${id}`:'/admin/events'; const res=await adminFetch(url,{method:id?'PUT':'POST',body:JSON.stringify(e)}); store.addAdminEvent({...e,id:res._id||id}); }catch{ store.addAdminEvent({...e,id:id||('ae-'+Date.now())}); } },
  async adminSaveMatch(m,id){ try{ const url=id?`/admin/matches/${id}`:'/admin/matches'; const res=await adminFetch(url,{method:id?'PUT':'POST',body:JSON.stringify(m)}); store.addAdminMatch({...m,id:res._id||id}); }catch{ store.addAdminMatch({...m,id:id||('am-'+Date.now())}); } },
  async adminSaveProduct(p,id){ try{ const url=id?`/admin/products/${id}`:'/admin/products'; const res=await adminFetch(url,{method:id?'PUT':'POST',body:JSON.stringify(p)}); store.addAdminProduct({...p,id:res._id||id}); }catch{ store.addAdminProduct({...p,id:id||('ap-'+Date.now())}); } },
  async adminSavePromo(p){ try{ const res=await adminFetch('/admin/promos',{method:'POST',body:JSON.stringify(p)}); store.addPromoCode({id:res._id,code:res.code,discount:res.discount,isActive:res.isActive,usageCount:0}); }catch{ store.addPromoCode({id:'promo-'+Date.now(),...p,usageCount:0}); } },
  async adminBroadcast(title,message){ try{ await adminFetch('/admin/notifications/broadcast',{method:'POST',body:JSON.stringify({title,message})}); }catch{} store.addNotification({id:'bc-'+Date.now(),userId:'ALL',title,message,isRead:false,fromAdmin:true,createdAt:new Date().toISOString()}); },
};

window.EVStore = store;
