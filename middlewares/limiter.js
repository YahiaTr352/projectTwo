// const RateLimit = require("../models/rateLimit");

// const skipLimiterForStatic = (req) => {
//   return (
//     req.method === "OPTIONS" ||
//     req.path === "/favicon.ico" ||
//     req.path.match(/\.(js|css|png|jpg|ico|svg|map|woff2?)$/)  // تخطي الملفات الثابتة
//   );
// };

// const rateLimiterMiddleware = async (req, res, next) => {
//   if (skipLimiterForStatic(req)) return next();  // إذا كان الطلب لملف ثابت يتم تخطي الـ Rate Limiter

//   const ip = req.ip || '';  // استخدام الـ IP للحد من الطلبات
//   const userID = req.cookies?.userID || '';  // إذا كان هناك userID في الكوكيز
//   const key = userID ? `cookie_${userID}` : `ip_${ip}`;  // تحديد الـ key بناءً على الـ userID أو الـ IP

//   try {
//     // البحث عن سجل الـ Rate Limit للمستخدم أو الـ IP
//     let rateLimitData = await RateLimit.findOne({ key });

//     if (!rateLimitData) {
//       // إذا لم يكن هناك سجل لهذا المفتاح، نقوم بإنشائه
//       rateLimitData = new RateLimit({ key });
//       await rateLimitData.save();
//     }

//     const currentTime = new Date();
//     const elapsedTime = (currentTime - rateLimitData.lastReset) / 1000;  // الفرق بالثواني

//     // إذا مر أكثر من ساعة، إعادة تعيين النقاط
//     if (elapsedTime > 60 * 60) {
//       rateLimitData.points = 1000;  // إعادة تعيين النقاط
//       rateLimitData.lastReset = currentTime;  // تحديث تاريخ آخر إعادة تعيين
//     }

//     // إذا كانت النقاط أقل من أو تساوي صفر، يتم حظر الطلب
//     if (rateLimitData.points <= 0) {
//       return res.status(429).json({
//         errorCode: -429,
//         errorDesc: 'Too many requests. Please try again later.',  // الرد عند تجاوز الحد
//       });
//     }

//     // خصم نقطة واحدة
//     rateLimitData.points -= 1;
//     await rateLimitData.save();  // حفظ التحديثات في MongoDB

//     next();  // إذا لم يتجاوز الحد، استمر في المعالجة
//   } catch (err) {
//     console.error('Rate limiting error:', err);
//     res.status(500).send('Internal Server Error');
//   }
// };

// module.exports = rateLimiterMiddleware;

// const RateLimit = require("../models/rateLimit");
// const axios = require("axios");

// const skipLimiterForStatic = (req) => {
//   return (
//     req.method === "OPTIONS" ||
//     req.path === "/favicon.ico" ||
//     req.path.match(/\.(js|css|png|jpg|ico|svg|map|woff2?)$/)
//   );
// };

// const checkVPN = async (ip) => {
//   try {
//     console.log(`🌐 Calling proxycheck.io for: ${ip}`);
//     const response = await axios.get(`https://proxycheck.io/v2/${ip}?key=1m3t93-nz9b86-g48v99-y3h554`);
//     const data = response.data;

//     console.log(`🔎 Raw response from proxycheck.io for IP ${ip}:`, JSON.stringify(data, null, 2));

//     const result = data[ip];

//     if (data.status === "ok" && result?.proxy === "yes") {
//       const type = result.type?.toLowerCase() || "unknown";
//       console.log(`🚨 Detected ${type.toUpperCase()} usage from IP: ${ip}`);
//       return { isVpn: true, type };
//     }

//     return { isVpn: false };
//   } catch (err) {
//     console.error("VPN check failed:", err.message);
//     return { isVpn: false };
//   }
// };

// const rateLimiterMiddleware = async (req, res, next) => {
//   console.log(`🔥 rateLimiterMiddleware triggered for IP: ${req.ip}`);

//   if (skipLimiterForStatic(req)) return next();

//   const ip = req.ip || "";
//   const userID = req.cookies?.userID || "";
//   const key = userID ? `cookie_${userID}` : `ip_${ip}`;

//   try {
//     const vpnCheck = await checkVPN(ip);
//     let rateLimitData = await RateLimit.findOne({ key });

//     if (!rateLimitData) {
//       rateLimitData = new RateLimit({ key, ipList: [] });
//     }

//     const currentTime = new Date();
//     const elapsedTime = (currentTime - rateLimitData.lastReset) / 1000;

//     if (elapsedTime > 60 * 60) {
//       rateLimitData.points = 1000;
//       rateLimitData.lastReset = currentTime;
//       rateLimitData.ipList = [];
//     }

//     // ✅ إذا تم الكشف عن VPN أو Tor أو Proxy
// if (vpnCheck.isVpn) {
//   rateLimitData.ipList = rateLimitData.ipList || [];

//   // تأكد إنه هذا الـ IP ما تم تسجيله خلال آخر 5 دقائق
//   const now = new Date();
//   const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

//   const recentIPs = rateLimitData.ipList.filter(entry =>
//     entry.ip === ip && entry.time > fiveMinutesAgo
//   );

//   if (recentIPs.length === 0) {
//     // أضف IP مع الوقت الحالي
//     rateLimitData.ipList.push({ ip, time: now });
//     console.log(`🔍 VPN/Proxy Detected: ${ip} saved at ${now.toISOString()}`);
//   } else {
//     console.log(`⚠️ VPN IP ${ip} already recorded recently.`);
//   }

//   // فحص عدد IPs خلال آخر 5 دقائق
//   const suspiciousCount = rateLimitData.ipList.filter(entry => entry.time > fiveMinutesAgo).length;

//   console.log(`📌 Suspicious IP count in last 5 min: ${suspiciousCount}`);

//   if (suspiciousCount >= 5) {
//     console.log(`⛔ Blocking user due to multiple suspicious VPN/Proxy accesses`);
//     return res.status(403).json({
//       errorCode: -403,
//       errorDesc: `Too many suspicious connections (VPN/Proxy/Tor). Access temporarily blocked.`,
//     });
//   }
// }


//     // تجاوز الحد
//     if (rateLimitData.points <= 0) {
//       return res.status(429).json({
//         errorCode: -429,
//         errorDesc: "Too many requests. Please try again later.",
//       });
//     }

//     rateLimitData.points -= 1;
//     await rateLimitData.save();

//     next();
//   } catch (err) {
//     console.error("Rate limiting error:", err);
//     res.status(500).send("Internal Server Error");
//   }
// };

// module.exports = rateLimiterMiddleware;


const RateLimit = require("../models/rateLimit");

const skipLimiterForStatic = (req) => {
  return (
    req.method === "OPTIONS" ||
    req.path === "/favicon.ico" ||
    req.path.match(/\.(js|css|png|jpg|ico|svg|map|woff2?)$/)
  );
};

const rateLimiterMiddleware = async (req, res, next) => {
  console.log(`🔥 rateLimiterMiddleware triggered for IP: ${req.ip}`);

  if (skipLimiterForStatic(req)) return next();

  const ip = req.ip || "";
  const userID = req.cookies?.userID || "";
  const key = userID ? `cookie_${userID}` : `ip_${ip}`;

  try {
    let rateLimitData = await RateLimit.findOne({ key });

    if (!rateLimitData) {
      rateLimitData = new RateLimit({ key, ipList: [], points: 1000, lastReset: new Date() });
    }

    const currentTime = new Date();
    const elapsedTime = (currentTime - rateLimitData.lastReset) / 1000;

    // Reset points every hour
    if (elapsedTime > 60 * 60) {
      rateLimitData.points = 1000;
      rateLimitData.lastReset = currentTime;
      rateLimitData.ipList = [];
    }

    // سجل الـ IP الحالي
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    rateLimitData.ipList = rateLimitData.ipList || [];

    // إذا هذا الـ IP غير موجود ضمن آخر 5 دقائق، ضيفه
    const alreadyRecorded = rateLimitData.ipList.some(entry => entry.ip === ip && entry.time > fiveMinutesAgo);

    if (!alreadyRecorded) {
      rateLimitData.ipList.push({ ip, time: now });
      console.log(`📥 New IP (${ip}) recorded for user: ${key}`);
    }

    // كم IP مختلف خلال آخر 5 دقائق؟
    const recentIPs = rateLimitData.ipList
      .filter(entry => entry.time > fiveMinutesAgo)
      .map(entry => entry.ip);

    const uniqueIPs = [...new Set(recentIPs)];

    console.log(`📊 Unique IPs for user ${key} in last 5 min:`, uniqueIPs.length);

    // إذا استخدم أكتر من 3 IPات مختلفة خلال 5 دقايق => سلوك مشبوه
    if (uniqueIPs.length >= 3) {
      console.log(`⛔ Blocking user ${key} due to frequent IP switching`);
      return res.status(403).json({
        errorCode: -403,
        errorDesc: `Too many IP changes detected. Access temporarily blocked.`,
      });
    }

    // التحقق من النقاط المتبقية
    if (rateLimitData.points <= 0) {
      return res.status(429).json({
        errorCode: -429,
        errorDesc: "Too many requests. Please try again later.",
      });
    }

    rateLimitData.points -= 1;
    await rateLimitData.save();

    next();
  } catch (err) {
    console.error("Rate limiting error:", err);
    res.status(500).send("Internal Server Error");
  }
};

module.exports = rateLimiterMiddleware;
