
// const express = require("express");
// const axios = require("axios");
// const potatoRoutes = require("./routes/potato");
// const cors = require("cors");
// const path = require("path");
// const session = require("express-session");
// const userAgentFilter = require("./middlewares/userAgentFilter");
// const cookieParser = require("cookie-parser");
// const ConnectDB = require("./config/config");
// const rateLimiterMiddleware = require("./middlewares/limiter");
// require("dotenv").config(); // تحميل متغيرات البيئة من .env


// const app = express();
// const port = process.env.PORT || 3001;

// // إعدادات عامة

// // app.use(cors());
// app.set('trust proxy', true);
// app.disable("x-powered-by");
// app.use(userAgentFilter);
// app.use(cookieParser());
// app.use(rateLimiterMiddleware);
// app.use(cors({
//   origin: "https://projecto-5vcbgtvn1-yahiatrs-projects.vercel.app",
//   credentials: true
// }));

// app.use(express.json());
// ConnectDB();
// app.use(express.static(path.join(__dirname, "public")));
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// // إعدادات الجلسة
// const sessionSecret = process.env.SESSION_SECRET || "default_session_secret";
// app.use(session({
//   secret: sessionSecret,
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: false,
//     httpOnly: true,
//     sameSite: "lax"
//   }
// }));

// // الراوتس
// app.use("/api/clients", potatoRoutes);

// // تشغيل السيرفر
// app.listen(port, () => {
//   console.log(`✅ Server is running on port ${port}`);
// });

// // const axios = require('axios');

// // const ip = '185.220.101.1';
// // const checkVPN = async (ip) => {
// //   try {
// //     const response = await axios.get(`https://proxycheck.io/v2/${ip}?key=1m3t93-nz9b86-g48v99-y3h554`);
// //     const data = response.data;
// //     console.log(data);
// //     if (data.status === 'ok' && data[ip].proxy === 'yes') {
// //       console.log(`IP ${ip} is using VPN/Proxy/Tor! 🚫`);
// //     } else {
// //       console.log(`IP ${ip} is clean ✅`);
// //     }
// //   } catch (error) {
// //     console.error('Error:', error);
// //   }
// // };

// // checkVPN(ip); // استبدل هذا بالـ IP الذي ترغب في فحصه


const express = require("express");
const axios = require("axios");
const potatoRoutes = require("./routes/potato");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const userAgentFilter = require("./middlewares/userAgentFilter");
const cookieParser = require("cookie-parser");
const ConnectDB = require("./config/config");
const rateLimiterMiddleware = require("./middlewares/limiter");
require("dotenv").config(); // تحميل متغيرات البيئة من .env

const app = express();
const port = process.env.PORT || 3001;

// ✅ ضروري للسيرفرات خلف proxy مثل Vercel أو Heroku
app.set('trust proxy', true);

// ✅ ملفات ثابتة (CSS, JS, صور)
app.use(express.static(path.join(__dirname, "public")));

// ✅ CORS قبل أي middleware يتعامل مع request
app.use(cors({
  origin: "*",
  credentials: true
}));

// ✅ مهم جداً لترتيب الطلبات بشكل صحيح
app.use(cookieParser());
app.use(express.json());

// ✅ Log أولي لتأكيد وصول الطلب للسيرفر
app.use((req, res, next) => {
  console.log(`📥 Incoming Request: ${req.method} ${req.originalUrl} | IP: ${req.ip}`);
  next();
});

// ✅ middleware التحديد والفلترة
app.use(rateLimiterMiddleware);

// ✅ بعد limiter (ما يعيق التنفيذ)
app.use(userAgentFilter);

// ✅ محرك العرض
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ✅ الاتصال بقاعدة البيانات
ConnectDB();

// ✅ إعدادات الجلسة
const sessionSecret = process.env.SESSION_SECRET || "default_session_secret";
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: "lax"
  }
}));

// ✅ تعريف الراوتات
app.use("/api/clients", potatoRoutes);

// ✅ بدء تشغيل السيرفر
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});
