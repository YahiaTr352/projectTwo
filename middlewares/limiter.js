const RateLimit = require("../models/rateLimit");

const skipLimiterForStatic = (req) => {
  return (
    req.method === "OPTIONS" ||
    req.path === "/favicon.ico" ||
    req.path.match(/\.(js|css|png|jpg|ico|svg|map|woff2?)$/)  // تخطي الملفات الثابتة
  );
};

const rateLimiterMiddleware = async (req, res, next) => {
  if (skipLimiterForStatic(req)) return next();  // إذا كان الطلب لملف ثابت يتم تخطي الـ Rate Limiter

  const ip = req.ip || '';  // استخدام الـ IP للحد من الطلبات
  const userID = req.cookies?.userID || '';  // إذا كان هناك userID في الكوكيز
  const key = userID ? `cookie_${userID}_${ip}` : `ip_${ip}`;  // تحديد الـ key بناءً على الـ userID أو الـ IP

  try {
    // البحث عن سجل الـ Rate Limit للمستخدم أو الـ IP
    let rateLimitData = await RateLimit.findOne({ key });

    if (!rateLimitData) {
      // إذا لم يكن هناك سجل لهذا المفتاح، نقوم بإنشائه
      rateLimitData = new RateLimit({ key });
      await rateLimitData.save();
    }

    const currentTime = new Date();
    const elapsedTime = (currentTime - rateLimitData.lastReset) / 1000;  // الفرق بالثواني

    // إذا مر أكثر من ساعة، إعادة تعيين النقاط
    if (elapsedTime > 60 * 60) {
      rateLimitData.points = 1000;  // إعادة تعيين النقاط
      rateLimitData.lastReset = currentTime;  // تحديث تاريخ آخر إعادة تعيين
    }

    // إذا كانت النقاط أقل من أو تساوي صفر، يتم حظر الطلب
    if (rateLimitData.points <= 0) {
      return res.status(429).json({
        errorCode: -429,
        errorDesc: 'Too many requests. Please try again later.',  // الرد عند تجاوز الحد
      });
    }

    // خصم نقطة واحدة
    rateLimitData.points -= 1;
    await rateLimitData.save();  // حفظ التحديثات في MongoDB

    next();  // إذا لم يتجاوز الحد، استمر في المعالجة
  } catch (err) {
    console.error('Rate limiting error:', err);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = rateLimiterMiddleware;
