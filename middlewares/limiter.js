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


const RateLimit = require("../models/rateLimit");
const axios = require("axios");

const skipLimiterForStatic = (req) => {
  return (
    req.method === "OPTIONS" ||
    req.path === "/favicon.ico" ||
    req.path.match(/\.(js|css|png|jpg|ico|svg|map|woff2?)$/)
  );
};

const checkVPN = async (ip) => {
  try {
    const response = await axios.get(`https://proxycheck.io/v2/${ip}?key=1m3t93-nz9b86-g48v99-y3h554`);
    const data = response.data;
    const result = data[ip];

    if (data.status === "ok" && result?.proxy === "yes") {
      const type = result.type?.toLowerCase() || "unknown";
      console.log(true);
      return { isVpn: true, type };
    }

    return { isVpn: false };
  } catch (err) {
    console.error("VPN check failed:", err.message);
    return { isVpn: false };
  }
};

const rateLimiterMiddleware = async (req, res, next) => {
  if (skipLimiterForStatic(req)) return next();

  const ip = req.ip || "";
  const userID = req.cookies?.userID || "";
  const key = userID ? `cookie_${userID}` : `ip_${ip}`;

  try {
    // فحص VPN / Proxy / Tor
    const vpnCheck = await checkVPN(ip);

    let rateLimitData = await RateLimit.findOne({ key });

    if (!rateLimitData) {
      rateLimitData = new RateLimit({ key, ipList: [ip] });
    }

    const currentTime = new Date();
    const elapsedTime = (currentTime - rateLimitData.lastReset) / 1000;

    // إذا مر أكثر من ساعة نعيد تعيين النقاط
    if (elapsedTime > 60 * 60) {
      rateLimitData.points = 1000;
      rateLimitData.lastReset = currentTime;
      rateLimitData.ipList = [];
    }

    // فحص الحظر المؤقت إذا في استخدام VPN/Tor متكرر
    if (vpnCheck.isVpn) {
      rateLimitData.ipList = rateLimitData.ipList || [];

      // أضف الـ IP إذا لم يكن موجود
      if (!rateLimitData.ipList.includes(ip)) {
        rateLimitData.ipList.push(ip);
      }

      // إذا أكثر من 3 IPs مشبوهة خلال 5 دقائق ⇒ حظر
      if (rateLimitData.ipList.length >= 5) {
        return res.status(403).json({
          errorCode: -403,
          errorDesc: `Too many suspicious connections (VPN/Proxy/Tor). Access temporarily blocked.`,
        });
      }
    }

    // إذا النقاط خلصت
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
