// // utils/ipLookup.js
// const axios = require('axios');

// const API_KEY = '9d3e3a4664094fb7b57f0b9a2c377aad'; // حط المفتاح تبعك هون

// async function lookupIP(ip) {
//   const url = `https://ipgeolocation.abstractapi.com/v1/?api_key=${API_KEY}&ip_address=${ip}`;

//   try {
//     const { data } = await axios.get(url);
//     return {
//       ip: data.ip_address,
//       country: data.country,
//       city: data.city,
//       isp: data.connection?.isp_name || 'Unknown',
//       is_vpn: data.security?.is_vpn || false,
//       is_proxy: data.security?.is_proxy || false,
//       is_tor: data.security?.is_tor || false,
//     };
//   } catch (err) {
//     console.error("❌ Error in lookupIP:", err.message);
//     return null;
//   }
// }

// module.exports = lookupIP;
