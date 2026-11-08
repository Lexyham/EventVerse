/* EventVerse — components.js — Header, Footer, EventCard, Toast, Modal, QR */
'use strict';

function currencySymbol(c){ return {GBP:'£',EUR:'€',AUD:'A$',CAD:'CA$',ZAR:'R',NGN:'₦',JPY:'¥',KRW:'₩',BRL:'R$',MXN:'$',SGD:'S$',AED:'د.إ'}[c] || '$'; }
window.currencySymbol = currencySymbol;

(function(){ const el=document.createElement('div'); el.id='toast-container'; document.body.appendChild(el); })();
function showToast(msg,type='info',duration=3500){
  const c=document.getElementById('toast-container');
  const icons={success:'✅',error:'❌',info:'ℹ️'};
  const t=document.createElement('div'); t.className=`toast toast-${type}`;
  t.innerHTML=`<span style="flex-shrink:0;font-size:16px">${icons[type]}</span><span style="flex:1;min-width:0;word-wrap:break-word">${msg}</span><button onclick="this.closest('.toast').remove()" style="background:none;border:none;color:var(--muted);cursor:pointer;font-size:16px;flex-shrink:0;padding:2px 4px">×</button>`;
  c.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; t.style.transition='opacity 0.3s'; setTimeout(()=>t.remove(),300); }, duration);
}
window.showToast = showToast;

function generateQR(value,size=72){
  const seed=value.split('').reduce((a,c)=>a+c.charCodeAt(0),0);
  const cells=Array.from({length:49},(_,i)=>((seed*(i+1)*137)%100)>45);
  const s=Math.floor(size/7);
  const grid=document.createElement('div');
  grid.style.cssText=`display:grid;grid-template-columns:repeat(7,${s}px);gap:1px;background:#fff;border-radius:8px;padding:6px;width:${size}px;height:${size}px;flex-shrink:0`;
  cells.forEach(f=>{ const c=document.createElement('div'); c.style.cssText=`background:${f?'#0F0F1A':'white'};border-radius:1px`; grid.appendChild(c); });
  return grid;
}
window.generateQR = generateQR;

function eventCardHTML(event, opts={}){
  const { size='md' } = opts;
  const cs=currencySymbol(event.price?.currency);
  const dStr = window.fmtDateShort ? fmtDateShort(new Date(event.date)) : new Date(event.date).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'});
  const isFav = window.EVStore ? window.EVStore.isFavorite(event.id) : false;
  const w = size==='lg' ? '' : size==='sm' ? 'width:180px' : 'width:260px';
  return `
    <a href="event.html?id=${event.id}" class="ev-card" style="${w};display:flex;flex-direction:column;text-decoration:none" data-event-id="${event.id}">
      <div style="position:relative;height:${size==='sm'?'130':'160'}px;overflow:hidden">
        <img src="${event.image}" alt="${event.title}" loading="lazy" style="width:100%;height:100%;object-fit:cover;transition:transform .5s">
        <div style="position:absolute;inset:0;background:linear-gradient(to top,#1A1A2E,transparent 60%)"></div>
        <div style="position:absolute;top:8px;left:8px;display:flex;gap:6px">
          ${event.hot?'<span class="hot-badge">🔥 HOT</span>':''}
          ${event.featured?'<span style="padding:2px 8px;border-radius:12px;background:rgba(59,130,246,0.7);color:#fff;font-size:10px;font-weight:700">⭐</span>':''}
        </div>
        <button class="fav-btn" data-id="${event.id}" onclick="event.preventDefault();event.stopPropagation();toggleFavBtn(this,'${event.id}')"
          style="position:absolute;top:8px;right:8px;width:30px;height:30px;border-radius:50%;background:rgba(0,0,0,0.5);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:15px;transition:all .2s">
          ${isFav?'❤️':'🤍'}
        </button>
        <div style="position:absolute;bottom:8px;right:8px;background:rgba(0,0,0,0.7);border-radius:8px;padding:3px 8px;font-size:12px;font-weight:700;color:#A78BFA">${cs}${event.price?.min?.toLocaleString?.()}</div>
      </div>
      <div style="padding:12px;flex:1;display:flex;flex-direction:column">
        <div style="color:#A78BFA;font-size:11px;font-weight:600;margin-bottom:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${event.artist}</div>
        <h3 style="color:#fff;font-size:13px;font-weight:700;line-height:1.35;margin-bottom:8px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">${event.title}</h3>
        <div style="display:flex;flex-direction:column;gap:3px;margin-top:auto">
          <div style="display:flex;align-items:center;gap:5px;color:#64748b;font-size:11px"><span style="color:#A78BFA">📍</span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${event.city}, ${event.country}</span></div>
          <div style="display:flex;align-items:center;gap:5px;color:#64748b;font-size:11px"><span style="color:#A78BFA">📅</span>${dStr}</div>
        </div>
        ${event.rating?`<div style="display:flex;align-items:center;gap:4px;margin-top:6px"><span style="color:#F59E0B;font-size:12px">★</span><span style="color:#F59E0B;font-size:12px;font-weight:700">${event.rating}</span>${event.reviewCount?`<span style="color:#64748b;font-size:10px">(${event.reviewCount.toLocaleString()})</span>`:''}</div>`:''}
      </div>
    </a>`;
}
window.eventCardHTML = eventCardHTML;

function toggleFavBtn(btn,id){
  if(!window.EVStore) return;
  EVStore.toggleFavorite(id);
  btn.textContent = EVStore.isFavorite(id)?'❤️':'🤍';
  showToast(EVStore.isFavorite(id)?'Added to favorites!':'Removed from favorites','info',2000);
}
window.toggleFavBtn = toggleFavBtn;

function injectHeader(){
  const ph=document.getElementById('header-placeholder'); if(!ph) return;
  const s = window.EVStore ? EVStore.getState() : {};
  const cartCount=(s.cart||[]).reduce((c,i)=>c+i.quantity,0)+(s.merchCart||[]).reduce((c,i)=>c+i.quantity,0);
  const unread = s.user ? EVStore.getUnreadCount(s.user.id) : 0;
  const path = window.location.pathname.split('/').pop() || 'index.html';
  function navActive(page){ return path===page?'nav-active':''; }

  ph.innerHTML = `
<header id="ev-header" style="position:fixed;top:0;left:0;right:0;z-index:100;transition:all .3s">
  <div class="glass-dark" style="border-bottom:1px solid rgba(108,43,217,0.15)">
    <div class="container" style="padding-top:10px;padding-bottom:10px">
      <div style="display:flex;align-items:center;gap:10px">
        <a href="index.html" style="display:flex;align-items:center;gap:8px;text-decoration:none;flex-shrink:0">
          <div style="width:36px;height:36px;border-radius:12px;background:linear-gradient(135deg,#6C2BD9,#EC4899);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(108,43,217,0.4)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
          </div>
          <span style="font-family:Poppins,sans-serif;font-size:20px;font-weight:900;color:#fff">Event<span style="background:linear-gradient(135deg,#6C2BD9,#EC4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text">Verse</span></span>
        </a>
        <form id="header-search-form" onsubmit="return headerSearch(event)" style="flex:1;max-width:320px;display:none;position:relative" class="hide-mobile">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);pointer-events:none"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input id="header-search-input" type="search" placeholder="Search events, artists..." class="ev-input" style="padding-left:38px;padding-right:12px;height:38px;font-size:13px" aria-label="Search events">
        </form>
        <div style="flex:1"></div>
        <div style="display:flex;align-items:center;gap:6px">
          <button onclick="toggleMobileSearch()" style="width:34px;height:34px;border-radius:10px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);cursor:pointer;display:flex;align-items:center;justify-content:center;color:#94a3b8" class="hide-desktop" aria-label="Search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </button>
          <a href="favorites.html" style="position:relative;width:34px;height:34px;border-radius:10px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;color:#94a3b8;text-decoration:none" aria-label="Favorites">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            ${(s.favorites||[]).length>0?`<span style="position:absolute;top:-4px;right:-4px;width:16px;height:16px;border-radius:50%;background:#EC4899;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;color:#fff">${(s.favorites||[]).length}</span>`:''}
          </a>
          <a href="cart.html" style="position:relative;width:34px;height:34px;border-radius:10px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;justify-content:center;color:#94a3b8;text-decoration:none" aria-label="Cart">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
            ${cartCount>0?`<span style="position:absolute;top:-4px;right:-4px;width:16px;height:16px;border-radius:50%;background:#6C2BD9;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;color:#fff">${cartCount}</span>`:''}
          </a>
          ${s.isAuthenticated?`
          <div style="position:relative" id="notif-wrapper">
            <button onclick="toggleNotifPanel()" style="position:relative;width:34px;height:34px;border-radius:10px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);cursor:pointer;display:flex;align-items:center;justify-content:center;color:#94a3b8" aria-label="Notifications">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              ${unread>0?`<span style="position:absolute;top:-4px;right:-4px;width:16px;height:16px;border-radius:50%;background:#EF4444;font-size:9px;font-weight:700;display:flex;align-items:center;justify-content:center;color:#fff;animation:ping 1.5s infinite">${unread}</span>`:''}
            </button>
            <div id="notif-panel" class="hidden" style="position:absolute;right:0;top:calc(100% + 8px);width:320px;max-width:calc(100vw - 32px);background:#1A1A2E;border:1px solid rgba(108,43,217,0.25);border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.5);z-index:200;max-height:380px;overflow-y:auto">
              <div style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,.06);display:flex;align-items:center;justify-content:space-between">
                <span style="color:#fff;font-size:14px;font-weight:700">Notifications</span><span style="color:#64748b;font-size:12px">${unread} unread</span>
              </div>
              <div id="notif-list">${buildNotifList(s)}</div>
            </div>
          </div>`:''}
          ${s.isAuthenticated?`
          <div style="position:relative" id="user-menu-wrapper">
            <button onclick="toggleUserMenu()" style="display:flex;align-items:center;gap:6px;padding:5px 10px;border-radius:10px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);cursor:pointer;color:#E2E8F0;font-size:13px">
              <div style="width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,#6C2BD9,#EC4899);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0">${(s.user?.name||'U')[0].toUpperCase()}</div>
              <span class="hide-mobile" style="max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${s.user?.name?.split(' ')[0]||'User'}</span>
            </button>
            <div id="user-menu" class="hidden" style="position:absolute;right:0;top:calc(100% + 8px);width:160px;background:#1A1A2E;border:1px solid rgba(108,43,217,0.2);border-radius:12px;overflow:hidden;z-index:200">
              <a href="my-tickets.html" style="display:flex;align-items:center;gap:8px;padding:10px 14px;color:#94a3b8;font-size:13px;text-decoration:none" onmouseover="this.style.background='rgba(108,43,217,0.08)'" onmouseout="this.style.background=''">🎟️ My Tickets</a>
              <a href="favorites.html" style="display:flex;align-items:center;gap:8px;padding:10px 14px;color:#94a3b8;font-size:13px;text-decoration:none" onmouseover="this.style.background='rgba(108,43,217,0.08)'" onmouseout="this.style.background=''">❤️ Favorites</a>
              <button onclick="EVStore.logout();location.href='index.html'" style="width:100%;display:flex;align-items:center;gap:8px;padding:10px 14px;color:#EF4444;font-size:13px;background:none;border:none;cursor:pointer;text-align:left" onmouseover="this.style.background='rgba(239,68,68,0.06)'" onmouseout="this.style.background=''">🚪 Sign Out</button>
            </div>
          </div>`:`
          <a href="login.html" class="btn btn-primary btn-sm" style="font-size:13px;flex-shrink:0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg> Sign In
          </a>`}
        </div>
      </div>
    </div>
    <div id="mobile-search-bar" class="hidden" style="padding:0 16px 10px">
      <form onsubmit="return headerSearch(event)" style="position:relative">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);pointer-events:none"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
        <input id="mobile-search-input" type="search" placeholder="Search events, artists..." class="ev-input" style="padding-left:36px;height:40px" aria-label="Search">
      </form>
    </div>
    <div style="border-top:1px solid rgba(255,255,255,.05);overflow-x:auto" class="scrollbar-hide">
      <div class="container" style="padding-top:0;padding-bottom:0">
        <nav style="display:flex;align-items:center;gap:2px;padding:6px 0;overflow-x:auto;white-space:nowrap" class="scrollbar-hide" aria-label="Main navigation">
          <a href="index.html" class="btn btn-sm ${navActive('index.html')}" style="color:${path==='index.html'?'#fff':'#94a3b8'};font-size:12px;padding:5px 10px">🏠 Home</a>
          <a href="stadium.html" class="btn btn-sm ${navActive('stadium.html')}" style="color:${path==='stadium.html'?'#22C55E':'#94a3b8'};font-size:12px;padding:5px 10px">⚽ Stadium</a>
          <a href="events.html?cat=concerts" class="btn btn-sm" style="color:#94a3b8;font-size:12px;padding:5px 10px">🎵 Concerts</a>
          <a href="events.html?cat=sports" class="btn btn-sm" style="color:#94a3b8;font-size:12px;padding:5px 10px">🏆 Sports</a>
          <a href="events.html?cat=arts" class="btn btn-sm" style="color:#94a3b8;font-size:12px;padding:5px 10px">🎭 Arts</a>
          <a href="events.html?cat=comedy" class="btn btn-sm" style="color:#94a3b8;font-size:12px;padding:5px 10px">😂 Comedy</a>
          <a href="events.html?cat=family" class="btn btn-sm" style="color:#94a3b8;font-size:12px;padding:5px 10px">👨‍👩‍👧 Family</a>
          <a href="vip.html" class="btn btn-sm" style="color:#F59E0B;font-size:12px;padding:5px 10px">👑 VIP</a>
          <div style="width:1px;height:16px;background:rgba(255,255,255,.1);margin:0 4px;flex-shrink:0"></div>
          <a href="hotels.html" class="btn btn-sm ${navActive('hotels.html')}" style="color:${path==='hotels.html'?'#fff':'#94a3b8'};font-size:12px;padding:5px 10px">🏨 Hotels</a>
          <a href="sell.html" class="btn btn-sm ${navActive('sell.html')}" style="color:${path==='sell.html'?'#fff':'#94a3b8'};font-size:12px;padding:5px 10px">🛍️ Shop</a>
          <a href="gift-cards.html" class="btn btn-sm ${navActive('gift-cards.html')}" style="color:${path==='gift-cards.html'?'#fff':'#94a3b8'};font-size:12px;padding:5px 10px">🎁 Gifts</a>
          <a href="help.html" class="btn btn-sm ${navActive('help.html')}" style="color:${path==='help.html'?'#fff':'#94a3b8'};font-size:12px;padding:5px 10px">💬 Help</a>
        </nav>
      </div>
    </div>
  </div>
</header>`;

  window.addEventListener('scroll', ()=>{ const h=document.getElementById('ev-header'); if(h) h.style.background = window.scrollY>40 ? 'rgba(15,15,26,0.97)' : ''; }, { passive:true });
  document.addEventListener('click', e=>{
    ['notif-panel','user-menu'].forEach(id=>{
      const el=document.getElementById(id);
      if(el && !el.classList.contains('hidden') && !e.target.closest(`#${id}`) && !e.target.closest(`[onclick*="${id.replace('-','')}"]`)) el.classList.add('hidden');
    });
  });
  const dsf=document.getElementById('header-search-form'); if(dsf) dsf.style.display='flex';
  const q = new URLSearchParams(window.location.search).get('q')||'';
  const si=document.getElementById('header-search-input'); if(si) si.value=q;
}

function buildNotifList(s){
  const user=s.user;
  if(!user) return '<div style="padding:16px;text-align:center;color:#64748b;font-size:13px">Sign in to view notifications</div>';
  const notifs=(s.notifications||[]).filter(n=>n.userId===user.id||n.userId==='ALL').slice().reverse().slice(0,10);
  if(!notifs.length) return '<div style="padding:16px;text-align:center;color:#64748b;font-size:13px">No notifications yet</div>';
  return notifs.map(n=>`
    <div onclick="EVStore.markNotificationRead('${n.id}');injectHeader()" style="padding:12px 16px;border-bottom:1px solid rgba(255,255,255,.04);cursor:pointer;${!n.isRead?'background:rgba(108,43,217,0.04)':''}">
      <div style="display:flex;align-items:flex-start;gap:8px">
        ${!n.isRead?'<div style="width:7px;height:7px;border-radius:50%;background:#6C2BD9;margin-top:4px;flex-shrink:0"></div>':'<div style="width:7px;flex-shrink:0"></div>'}
        <div style="flex:1;min-width:0">
          <div style="color:#fff;font-size:12px;font-weight:600;word-wrap:break-word">${n.title}</div>
          <div style="color:#64748b;font-size:11px;margin-top:2px;word-wrap:break-word;line-height:1.5">${n.message}</div>
          ${n.reply?`<div style="margin-top:6px;padding:6px 10px;background:rgba(108,43,217,0.1);border-radius:8px;font-size:11px;color:#A78BFA;word-wrap:break-word"><strong>Admin:</strong> ${n.reply}</div>`:''}
          <div style="color:#475569;font-size:10px;margin-top:3px">${n.createdAt?new Date(n.createdAt).toLocaleDateString():''}</div>
        </div>
      </div>
    </div>`).join('');
}

function toggleNotifPanel(){ const p=document.getElementById('notif-panel'); const m=document.getElementById('user-menu'); if(m)m.classList.add('hidden'); if(p)p.classList.toggle('hidden'); }
function toggleUserMenu(){ const m=document.getElementById('user-menu'); const p=document.getElementById('notif-panel'); if(p)p.classList.add('hidden'); if(m)m.classList.toggle('hidden'); }
function toggleMobileSearch(){ const b=document.getElementById('mobile-search-bar'); if(b){ b.classList.toggle('hidden'); if(!b.classList.contains('hidden')) b.querySelector('input')?.focus(); } }
function headerSearch(e){ e.preventDefault(); const q=(document.getElementById('header-search-input')||document.getElementById('mobile-search-input'))?.value?.trim(); if(q) window.location.href=`events.html?q=${encodeURIComponent(q)}`; return false; }
window.toggleNotifPanel=toggleNotifPanel; window.toggleUserMenu=toggleUserMenu; window.toggleMobileSearch=toggleMobileSearch; window.headerSearch=headerSearch; window.injectHeader=injectHeader;

function injectFooter(){
  const ph=document.getElementById('footer-placeholder'); if(!ph) return;
  const yr=new Date().getFullYear();
  ph.innerHTML = `
<footer style="background:#0a0a14;border-top:1px solid rgba(108,43,217,0.15);padding:48px 0 24px">
  <div class="container">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:40px">
      <div style="grid-column:1/-1">
        <a href="index.html" style="display:flex;align-items:center;gap:10px;text-decoration:none;margin-bottom:14px">
          <div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#6C2BD9,#EC4899);display:flex;align-items:center;justify-content:center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M20 12V22H4V12"/><path d="M22 7H2v5h20V7z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
          </div>
          <span style="font-family:Poppins,sans-serif;font-size:22px;font-weight:900;color:#fff">Event<span style="background:linear-gradient(135deg,#6C2BD9,#EC4899);-webkit-background-clip:text;-webkit-text-fill-color:transparent">Verse</span></span>
        </a>
        <p style="color:#64748b;font-size:14px;line-height:1.7;max-width:400px">The world's most immersive live event ticketing platform. Discover 200+ concerts, sports, comedy and stadium experiences across 40+ countries.</p>
        <div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap">
          <a href="tel:+18004386837" style="display:flex;align-items:center;gap:6px;color:#A78BFA;font-size:13px;text-decoration:none">📞 +1 (800) EVENTVERSE</a>
          <span style="color:#475569">·</span>
          <a href="mailto:support@eventverse.com" style="color:#A78BFA;font-size:13px;text-decoration:none">✉️ support@eventverse.com</a>
        </div>
      </div>
      <div>
        <h4 style="color:#fff;font-size:14px;font-weight:700;margin-bottom:14px;text-transform:uppercase;letter-spacing:1px">Explore</h4>
        <div style="display:flex;flex-direction:column;gap:9px">
          <a href="events.html" style="color:#64748b;font-size:13px;text-decoration:none" onmouseover="this.style.color='#A78BFA'" onmouseout="this.style.color='#64748b'">Browse Events</a>
          <a href="stadium.html" style="color:#64748b;font-size:13px;text-decoration:none" onmouseover="this.style.color='#A78BFA'" onmouseout="this.style.color='#64748b'">Stadium Booking</a>
          <a href="hotels.html" style="color:#64748b;font-size:13px;text-decoration:none" onmouseover="this.style.color='#A78BFA'" onmouseout="this.style.color='#64748b'">Hotels & Stays</a>
          <a href="sell.html" style="color:#64748b;font-size:13px;text-decoration:none" onmouseover="this.style.color='#A78BFA'" onmouseout="this.style.color='#64748b'">Official Merch</a>
          <a href="gift-cards.html" style="color:#64748b;font-size:13px;text-decoration:none" onmouseover="this.style.color='#A78BFA'" onmouseout="this.style.color='#64748b'">Gift Cards</a>
          <a href="vip.html" style="color:#64748b;font-size:13px;text-decoration:none" onmouseover="this.style.color='#A78BFA'" onmouseout="this.style.color='#64748b'">VIP Packages</a>
        </div>
      </div>
      <div>
        <h4 style="color:#fff;font-size:14px;font-weight:700;margin-bottom:14px;text-transform:uppercase;letter-spacing:1px">Support</h4>
        <div style="display:flex;flex-direction:column;gap:9px">
          <a href="help.html" style="color:#64748b;font-size:13px;text-decoration:none" onmouseover="this.style.color='#A78BFA'" onmouseout="this.style.color='#64748b'">Help Center</a>
          <a href="mailto:support@eventverse.com" style="color:#64748b;font-size:13px;text-decoration:none" onmouseover="this.style.color='#A78BFA'" onmouseout="this.style.color='#64748b'">Contact Support</a>
          <a href="my-tickets.html" style="color:#64748b;font-size:13px;text-decoration:none" onmouseover="this.style.color='#A78BFA'" onmouseout="this.style.color='#64748b'">My Tickets</a>
          <a href="login.html" style="color:#64748b;font-size:13px;text-decoration:none" onmouseover="this.style.color='#A78BFA'" onmouseout="this.style.color='#64748b'">Sign In / Register</a>
        </div>
      </div>
    </div>
    <div style="border-top:1px solid rgba(255,255,255,.06);padding-top:20px;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px">
      <div style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">
        <span style="color:#64748b;font-size:12px">Accepted payments:</span>
        ${['₿ BTC','Ξ ETH','₮ USDT','🎁 Gift Cards'].map(p=>`<span style="padding:3px 10px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08);border-radius:6px;font-size:11px;color:#94a3b8">${p}</span>`).join('')}
      </div>
      <p style="color:#475569;font-size:12px;text-align:center">© ${yr} EventVerse Limited. All rights reserved. · <a href="help.html" style="color:#475569;text-decoration:none">Privacy</a> · <a href="help.html" style="color:#475569;text-decoration:none">Terms</a></p>
    </div>
  </div>
</footer>`;
}
window.injectFooter = injectFooter;

document.addEventListener('DOMContentLoaded', ()=>{
  injectHeader(); injectFooter();
  window.addEventListener('ev-state-change', ()=>{ injectHeader(); injectFooter(); });
});
