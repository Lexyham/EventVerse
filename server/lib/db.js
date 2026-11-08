const mongoose = require('mongoose');
let connected = false;
async function connectDB() {
  if (connected) return;
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/eventverse', { serverSelectionTimeoutMS: 5000 });
    connected = true;
    console.log('✅ MongoDB connected:', mongoose.connection.host);
  } catch (err) {
    console.error('❌ MongoDB failed:', err.message);
    console.log('⚠️  Running in local-storage-only mode (client still works via localStorage)');
  }
}
module.exports = { connectDB };
