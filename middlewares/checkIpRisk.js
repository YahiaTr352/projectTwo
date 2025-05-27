// const axios = require('axios');

// const API_KEY = '9d3e3a4664094fb7b57f0b9a2c377aad';

// async function checkIpRisk(req, res, next) {
//   try {
//     const clientIp =
//       req.headers['x-forwarded-for']?.split(',')[0] ||
//       req.connection.remoteAddress;

//     const ip = clientIp === '::1' ? '8.8.8.8' : clientIp;

//     const { data } = await axios.get(`https://ipgeolocation.abstractapi.com/v1/?api_key=${API_KEY}&ip_address=${ip}`);

//     let riskScore = 0;
//     if (data.is_tor) riskScore += 100;
//     if (data.is_vpn) riskScore += 40;
//     if (data.is_proxy) riskScore += 40;
//     if (data.country && data.country !== 'Syria') riskScore += 30;
//     if (data.isp === 'Unknown') riskScore += 10;
//     if (!data.city) riskScore += 10;

//     if (riskScore >= 100) {
//       return res.status(403).json({
//         error: '🚫 High risk activity detected. Access denied.',
//         ip: data.ip,
//         riskScore,
//         details: data,
//       });
//     }

//     if (riskScore >= 70) {
//       return res.status(429).json({
//         warning: '⚠️ Suspicious activity. Please complete verification.',
//         requireOtp: true,
//         ip: data.ip,
//         riskScore,
//         details: data,
//       });
//     }

//     req.clientIpInfo = data;
//     req.riskScore = riskScore; // مفيد لاحقاً

//     next();
//   } catch (err) {
//     console.error('IP Risk check error:', err.message);
//     return res.status(500).json({
//       error: 'Server error while checking IP risk.',
//     });
//   }
// }

// module.exports = checkIpRisk;
