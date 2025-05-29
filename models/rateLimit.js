// const mongoose = require('mongoose');

// const rateLimitSchema = new mongoose.Schema({
//   key: { type: String, required: true }, // يمكن أن يكون الـ IP أو الـ userID
//   points: { type: Number, default: 1000 }, // عدد النقاط المتبقية
//   lastReset: { type: Date, default: Date.now }, // آخر وقت تم فيه إعادة تعيين النقاط
// });

// const RateLimit = mongoose.model('RateLimit', rateLimitSchema);

// module.exports = RateLimit;

const mongoose = require('mongoose');

const rateLimitSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  points: { type: Number, default: 1000 },
  lastReset: { type: Date, default: Date.now },
  ipList: [String],
});

module.exports = mongoose.model('RateLimit', rateLimitSchema);
