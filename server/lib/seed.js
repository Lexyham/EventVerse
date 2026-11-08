require('dotenv').config();
const mongoose = require('mongoose');
const PromoCode = require('../models/PromoCode');
const Notification = require('../models/Notification');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/eventverse');
  console.log('Connected. Seeding...');
  const promos = [
    { code: 'FULL100', discount: 100 },
    { code: 'HALF50',  discount: 50  },
    { code: 'SAVE25',  discount: 25  },
    { code: 'VIP10',   discount: 10  },
  ];
  for (const p of promos) await PromoCode.findOneAndUpdate({ code: p.code }, p, { upsert: true, new: true });
  console.log('✅ Promo codes seeded');
  await Notification.findOneAndUpdate(
    { userId: 'ALL', title: '🎉 Welcome to EventVerse!' },
    { userId: 'ALL', title: '🎉 Welcome to EventVerse!', message: 'Thank you for joining! Browse 187+ events worldwide. Use code SAVE25 for 25% off your first booking!', fromAdmin: true, isRead: false },
    { upsert: true }
  );
  console.log('✅ Welcome notification seeded');
  await mongoose.disconnect();
  console.log('✅ Seed complete!');
}
seed().catch(console.error);
