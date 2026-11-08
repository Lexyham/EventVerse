/* Supplementary data extracted verbatim from the original React source
   (these lived in component files, not /src/data, so they ship separately
   from ev-core-data.js but are equally "real" — not fabricated). */
(function(){
'use strict';

window.testimonials = [
  { name:'Sarah M.', loc:'London, UK', rating:5, color:'from-purple-500 to-pink-500', text:"EventVerse made booking Taylor Swift tickets completely seamless. The site is gorgeous and I got my tickets in minutes. 10/10!", daysAgo:1 },
  { name:'James K.', loc:'Atlanta, USA', rating:5, color:'from-blue-500 to-cyan-500', text:"Stadium booking feature is incredible. Got Chelsea vs Liverpool tickets with so much ease. The QR ticket worked perfectly at the gate.", daysAgo:2 },
  { name:'Amara O.', loc:'Lagos, Nigeria', rating:5, color:'from-green-500 to-emerald-500', text:"Booked Burna Boy Lagos tickets through here. The experience was amazing — the website is smooth and tickets came instantly!", daysAgo:3 },
  { name:'Yuki T.', loc:'Tokyo, Japan', rating:5, color:'from-amber-500 to-orange-500', text:"Bought BTS concert tickets via EventVerse. Customer service was brilliant and the nearby hotel feature helped me plan my whole trip!", daysAgo:4 },
  { name:'Maria L.', loc:'Madrid, Spain', rating:5, color:'from-rose-500 to-pink-500', text:"Got front row tickets to Karol G at Bernabéu through EventVerse. The VIP experience was unforgettable. Already planning my next booking!", daysAgo:5 },
  { name:'David C.', loc:'Toronto, Canada', rating:5, color:'from-violet-500 to-purple-500', text:"Fast, reliable, and the dark UI is absolutely beautiful. Booked stadium tickets for the FIFA World Cup qualifier — can't wait!", daysAgo:6 },
  { name:'Emma R.', loc:'Manchester, UK', rating:4, color:'from-teal-500 to-cyan-500', text:"Good platform overall but I wish they would improve the payment process. Had to try twice before my crypto payment went through. Still would recommend.", daysAgo:7 },
  { name:'Sofia B.', loc:'São Paulo, Brazil', rating:5, color:'from-yellow-500 to-amber-500', text:"Booked Anitta tickets for Allianz Parque. Payment was smooth through crypto. This deserves to be on the PlayStore and AppStore, not just browser!", daysAgo:9 },
  { name:'Aisha D.', loc:'Riyadh, Saudi Arabia', rating:5, color:'from-purple-500 to-indigo-500', text:"Excellent service! Booked The Weeknd tickets in Dubai. Everything was perfect from booking to event day. Will definitely use again for future events.", daysAgo:11 },
  { name:'Ren L.', loc:'Seoul, South Korea', rating:5, color:'from-pink-500 to-rose-500', text:"Booked Jungkook tickets for Seoul Olympic Stadium. The whole process was incredibly smooth. The nearby hotel feature found me a great place within walking distance!", daysAgo:15 },
  { name:'Marcus T.', loc:'Chicago, USA', rating:5, color:'from-cyan-500 to-blue-500', text:"Used EventVerse to book Tyler the Creator at Hollywood Bowl. Crypto payment was fast and the QR code worked perfectly. This is the future of event ticketing!", daysAgo:17 },
  { name:'Aaliya F.', loc:'Nairobi, Kenya', rating:5, color:'from-purple-400 to-violet-500', text:"Discovered this site through a friend and I'm hooked. The dark theme is so professional and the event cards look amazing. Already told 10 friends about it!", daysAgo:22 },
];

window.celebrities = [
  { name:'Taylor Swift', emoji:'🎤', image:'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=400&q=80', charity:"Taylor's Small Business Fund", desc:"Support Taylor's mission to uplift small businesses and emerging artists worldwide." },
  { name:'Beyoncé', emoji:'👑', image:'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&q=80', charity:"BeyGOOD Foundation", desc:"Beyoncé's BeyGOOD Foundation supports communities in crisis and economic empowerment." },
  { name:'Burna Boy', emoji:'🌍', image:'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80', charity:"African Giant Foundation", desc:"Burna Boy's foundation supports youth empowerment across West Africa." },
  { name:'Karol G', emoji:'💃', image:'https://images.unsplash.com/photo-1516450137517-162bfbeb8dba?w=400&q=80', charity:"Bichota Foundation Colombia", desc:"Karol G supports education and women's empowerment in Colombia." },
  { name:'Adele', emoji:'🎶', image:'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&q=80', charity:"Adele Giving Back Fund", desc:"Support Adele's global charitable work supporting children's welfare." },
  { name:'Wizkid', emoji:'⭐', image:'https://images.unsplash.com/photo-1471478331149-c72f17e33c73?w=400&q=80', charity:"Starboy Foundation Africa", desc:"Wizkid's foundation builds schools and healthcare centres across Nigeria." },
  { name:'Billie Eilish', emoji:'🌱', image:'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&q=80', charity:"Billie's Eco Fund", desc:"Support Billie's climate activism and environmental conservation initiatives." },
  { name:'Morgan Wallen', emoji:'🤠', image:'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80', charity:"Morgan Wallen Foundation", desc:"Supporting rural music education and community outreach in Tennessee." },
  { name:'Drake', emoji:'🏀', image:'https://images.unsplash.com/photo-1493676304819-0d7a8d026dcf?w=400&q=80', charity:"DreamCrew Initiative", desc:"Drake's initiative supports youth basketball programmes and arts education in Toronto." },
  { name:'Rihanna', emoji:'🌺', image:'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80', charity:"Clara Lionel Foundation", desc:"Rihanna's CLF funds education, emergency response and climate resilience globally." },
  { name:'Tyla', emoji:'💫', image:'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400&q=80', charity:"Tyla SA Youth Arts Fund", desc:"Tyla supports aspiring artists and performing arts education in South Africa." },
  { name:'Bad Bunny', emoji:'🐰', image:'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400&q=80', charity:"Fundación Un Verano Sin Ti", desc:"Bad Bunny's foundation supports Puerto Rican communities and cultural preservation." },
];

window.PLATFORM_GIFT_OPTIONS = [
  { name:'EventVerse Community Fund', icon:'🎪', desc:'Keep live events accessible for fans worldwide. Your gift directly subsidises ticket costs for low-income fans.' },
  { name:'EventVerse Green Initiative', icon:'🌱', desc:'Help us offset the carbon footprint of live events through verified reforestation and renewable energy projects.' },
];

// Hero slides — IDs verified against the real events/staticMatches arrays
window.HERO_SLIDES = [
  { artist:'Taylor Swift', subtitle:'The Eras Tour', city:'London, UK', image:'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=1400&q=80', link:'event.html?id=c001' },
  { artist:'FIFA World Cup 2026', subtitle:'Final · MetLife Stadium', city:'East Rutherford, USA', image:'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1400&q=80', link:'stadium-detail.html?id=sm-002' },
  { artist:'Beyoncé', subtitle:'Renaissance World Tour', city:'Johannesburg, SA', image:'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1400&q=80', link:'event.html?id=c026' },
  { artist:'Burna Boy', subtitle:'Space Drift Tour', city:'London, UK', image:'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1400&q=80', link:'event.html?id=c069' },
  { artist:'El Clásico', subtitle:'Real Madrid vs Barcelona', city:'Madrid, Spain', image:'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1400&q=80', link:'stadium-detail.html?id=sm-003' },
  { artist:'Adele', subtitle:'Live in London', city:'London, UK', image:'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1400&q=80', link:'event.html?id=c063' },
  { artist:'Karol G', subtitle:'Mañana Será Bonito Tour', city:'Medellín, Colombia', image:'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1400&q=80', link:'event.html?id=c053' },
  { artist:'Coachella 2026', subtitle:'VIP Weekend · Empire Polo Club', city:'Indio, CA, USA', image:'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1400&q=80', link:'event.html?id=v003' },
  { artist:'Tyson Fury vs Anthony Joshua', subtitle:'Heavyweight Championship', city:'London, UK', image:'https://images.unsplash.com/photo-1549200424-9f610a28e72d?w=1400&q=80', link:'event.html?id=s009' },
  { artist:'Morgan Wallen', subtitle:'One Night At A Time Tour', city:'Nashville, USA', image:'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1400&q=80', link:'event.html?id=c086' },
];

// Crypto wallet addresses — verbatim from original Cart.tsx / GiftCards.tsx
window.CRYPTO_WALLETS = {
  BTC:  '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNA',
  ETH:  '0x742d35Cc6634C0532925a3b844Bc9e6d8f4b',
  USDT: 'TN3W4T7zYNmNDLF6G8H1zT8L5qD9w4ojkL',
  BNB:  'bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2',
  SOL:  'DRpbCBMxVnDK7maPLmBGrFtQF9DT5EJQGUxyz',
};

})();
