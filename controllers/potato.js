// const { v4: uuidv4 } = require("uuid"); // npm i uuid
// const axios = require("axios");
// const { isValidString, isValidNumber, validateMerchantPhoneNumber, validateCustomerPhoneNumber, isValidAmount, verifyToken, isValidOTP } = require("../utils/validation");
// const { getVaultSecret } = require("../utils/vaultClient"); // غيّر المسار حسب المشروع
// let BASE_API_URL;

// (async () => {
//   try {
//     BASE_API_URL = await getVaultSecret("config", "BASE_API_URL");
//     console.log("🔗 BASE_API_URL from Vault:", BASE_API_URL);
//   } catch (err) {
//     console.error("🚨 Failed to load BASE_API_URL from Vault");
//     process.exit(1);
//   }
// })();

// const getToken = async (req, res) => {
//   try {
//     const { companyName, programmName, merchantMSISDN , code } = req.body;

//     if(!isValidString(companyName)) return res.status(400).json({message : "Invalid CompanyName"});
//     if(!isValidString(programmName)) return res.status(400).json({message : "Invalid ProgrammName"});
//     if (!validateMerchantPhoneNumber(merchantMSISDN)) {
//       return res.status(400).json({ message: "Invalid Merchant Phone Number. It must start with a '+' followed by digits." });
//     }
//     if(!isValidNumber(code)) return res.status(400).json({message : "Invalid Code"});

//     const response = await axios.post(`${BASE_API_URL}/api/clients/get-token`, {
//       programmName,
//       companyName,
//       merchantMSISDN,
//       code,
//     });

//     return res.status(response.status).json(response.data);
//   } catch (error) {
//     if (error.response) {
//       return res.status(error.response.status).json(error.response.data);
//     }
//     console.error("Error forwarding request:", error);
//   }
// };

// const paymentRequest = async (req, res) => {
//   try {
//     const { transactionID } = req.session.paymentData;
//     const { code, customerMSISDN, merchantMSISDN , amount, token } = req.body;
//     // console.log("SESSION:", req.session);

//     if (!transactionID) {
//       return res.status(400).json({ message: "Session expired or missing transaction ID" });
//     }
    
//     if(!isValidNumber(code)) return res.status(400).json({message : "Invalid Code"});
//     if (!validateMerchantPhoneNumber(merchantMSISDN)) {
//       return res.status(400).json({ message: "Invalid Merchant Phone Number. It must start with a '+' followed by digits." });
//     }

//     if(!validateCustomerPhoneNumber(customerMSISDN)) {
//       return res.status(400).json({message : "Invalid Phone Number. It must be a Syrian number starting with 09."});
//     }

//     if(!isValidAmount(amount)) return res.status(400).json({message : "Invalid Amount"});

//     // if(!isValidString(token)) return res.status(400).json({message : "Invalid token"});

//     const response = await axios.post(`${BASE_API_URL}/api/clients/payment-request`, {
//       code,
//       customerMSISDN,
//       merchantMSISDN,
//       transactionID,
//       amount,
//       token,
//     });

//     if (response.data.details.otp) {
//       req.session.paymentData = {
//         ...req.session.paymentData,
//         otp: response.data.details.otp
//       };
//     }
//       // console.log(`"response" : ${response}`);
//     return res.status(response.status).json(response.data);
//     } catch (error) {
//       if (error.response) {
//         return res.status(error.response.status).json(error.response.data);
//       }
//       console.error("Error forwarding request:", error.message);
//     }
// };

// const paymentConfirmation = async (req, res) => {
//   try {
//     const { transactionID } = req.session.paymentData;
//     const { code, merchantMSISDN, OTP , token } = req.body;

//     // console.log("SESSION 🔍:", req.session);
//     // console.log("SESSION.paymentData 🔍:", req.session.paymentData);


//     if (!transactionID) {
//       return res.status(400).json({ message: "Session expired or missing transaction ID" });
//     }

//     if(!isValidNumber(code)) return res.status(400).json({message : "Invalid Code"});
//     if (!validateMerchantPhoneNumber(merchantMSISDN)) {
//       return res.status(400).json({ message: "Invalid Merchant Phone Number. It must start with a '+' followed by digits." });
//     }

//     if(!isValidOTP(OTP)) return res.status(400).json({message : "Invalid OTP"});
    
//     // if(!isValidString(token)) return res.status(400).json({message : "Invalid token"});

//     const response = await axios.post(`${BASE_API_URL}/api/clients/payment-confirmation`, {
//       code,
//       transactionID,
//       merchantMSISDN,
//       OTP,
//       token,
//     });

//     return res.status(response.status).json(response.data);
//   } catch (error) {
//     if (error.response) {
//       return res.status(error.response.status).json(error.response.data);
//     }
//     console.error("Error forwarding request:", error.message);
//     console.log(error);
//   }
// };

// const resendOTP = async (req, res) => {
//   try {
//     const { transactionID } = req.session.paymentData;
//     const { code, merchantMSISDN , token } = req.body;

//     if (!transactionID) {
//       return res.status(400).json({ message: "Session expired or missing transaction ID" });
//     }

//     if(!isValidNumber(code)) return res.status(400).json({message : "Invalid Code"});
//     if (!validateMerchantPhoneNumber(merchantMSISDN)) {
//       return res.status(400).json({ message: "Invalid Merchant Phone Number. It must start with a '+' followed by digits." });
//     }
    
//     // if(!isValidString(token)) return res.status(400).json({message : "Invalid token"});

//     const response = await axios.post(`${BASE_API_URL}/api/clients/resend-otp`, {
//       code,
//       transactionID,
//       merchantMSISDN,
//       token,
//     });

//     return res.status(response.status).json(response.data);
//   } catch (error) {
//     if (error.response) {
//       return res.status(error.response.status).json(error.response.data);
//     }
//     console.error("Error forwarding request:", error.message);
//   }
// };

// const customerPhonePage = (req, res) => {
//   const { companyName, programmName, code, merchantMSISDN, amount } = req.body;
//   const isDevRequest = req.headers["x-dev-request"] === "true";

//   if (!isValidString(companyName)) {
//     return isDevRequest ? res.status(400).json({ message: "Invalid CompanyName" }) : res.status(204).end();
//   }

//   if (!isValidString(programmName)) {
//     return isDevRequest ? res.status(400).json({ message: "Invalid ProgrammName" }) : res.status(204).end();
//   }

//   if (!isValidNumber(code)) {
//     return isDevRequest ? res.status(400).json({ message: "Invalid Code" }) : res.status(204).end();
//   }


//   if (!validateMerchantPhoneNumber(merchantMSISDN)) {
//     return isDevRequest ? res.status(400).json({ message: "Invalid Merchant Phone Number" }) : res.status(204).end();
//   }

//   if (!isValidAmount(amount)) {
//     return isDevRequest ? res.status(400).json({ message: "Invalid Amount" }) : res.status(204).end();
//   }

//   const transactionID = uuidv4(); 

//   req.session.paymentData = {
//     companyName,
//     programmName,
//     code,
//     transactionID,
//     merchantMSISDN,
//     amount,
//     otp : null
//   };

//   res.render("pages/customerPhone/customerPhone");
// };

// const otpVerificationPage = (req, res) => {
//   try{
//   // const {otp} = req.query;
//   const data = req.session.paymentData;

//   if (!data) {
//     return res.status(400).send("Session expired or invalid");
//   }

//   res.render("pages/otpVerification/otpVerification");

//   console.log("📍 OTP Verification Page Session:", req.session);
  
// }catch(error){
//   return res.status(400).json({error})
// }
// };

// const getPaymentData = (req, res) => {
//   if (!req.session.paymentData) {
//     return res.status(401).json({ message: "Unauthorized" });
//   }
//   res.json(req.session.paymentData);
// };

// const getBaseURL = async (req, res) => {
//   try {
//     const baseURL = await getVaultSecret("config", "BASE_API_URL2");
//     res.json({ baseURL });
//   } catch (error) {
//     res.status(500).json({ message: "Vault access error." });
//   }
// };

// module.exports = {
//   getToken,
//   paymentRequest,
//   paymentConfirmation,
//   resendOTP,
//   customerPhonePage,
//   otpVerificationPage,
//   getPaymentData,
//   getBaseURL
// };


const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const crypto = require('crypto');
const { generateKeyPairSync } = require('crypto');
const {
  isValidString,
  isValidNumber,
  validateMerchantPhoneNumber,
  validateCustomerPhoneNumber,
  isValidAmount,
  isValidOTP
} = require("../utils/validation");

const {
  generateRSAKeyPair,
  encryptHybrid,
  decryptHybrid,
  sendEncryptedError
} = require('../utils/encryption');
const paymentData = require("../models/paymentDataModel");

const BASE_API_URL = "https://projectone-wqlf.onrender.com";
// BASE_API_URL = "http://localhost:5000";
// ======== API Handlers ========

// const getToken = async (req, res) => {
//   try {
//     const { companyName, programmName, merchantMSISDN, code } = req.body;

//     if (!isValidString(companyName)) return res.status(400).json({ message: "Invalid CompanyName" });
//     if (!isValidString(programmName)) return res.status(400).json({ message: "Invalid ProgrammName" });
//     if (!validateMerchantPhoneNumber(merchantMSISDN)) return res.status(400).json({ message: "Invalid Merchant Phone Number" });
//     if (!isValidNumber(code)) return res.status(400).json({ message: "Invalid Code" });

//     const response = await axios.post(`${BASE_API_URL}/api/clients/get-token`, {
//       programmName,
//       companyName,
//       merchantMSISDN,
//       code,
//     });

//     return res.status(response.status).json(response.data);
//   } catch (error) {
//     if (error.response) return res.status(error.response.status).json(error.response.data);
//     console.error("Error forwarding request:", error);
//   }
// };


// const getToken = async (req, res) => {
//   try {
//     const encryptedBody = req.body;

//     const serverPrivateKey = req.session?.serverPrivateKey;
//     const clientPublicKey = req.session?.clientPublicKey;

//     if (!serverPrivateKey || !clientPublicKey) {
//       return res.status(401).json({ message: 'Missing encryption keys in session' });
//     }

//     // 1️⃣ فك تشفير البيانات القادمة
//     let decryptedData;
//     try {
//       decryptedData = JSON.parse(decryptHybrid(encryptedBody, serverPrivateKey));
//     } catch (e) {
//       console.error("Decryption failed:", e);
//       return res.status(400).json({ message: 'Invalid encrypted payload' });
//     }

//     const { companyName, programmName, merchantMSISDN, code } = decryptedData;

//     // 2️⃣ تحقق من صحة البيانات
//     if (!isValidString(companyName)) return sendEncryptedError(res, clientPublicKey, "Invalid CompanyName");
//     if (!isValidString(programmName)) return sendEncryptedError(res, clientPublicKey, "Invalid ProgrammName");
//     if (!validateMerchantPhoneNumber(merchantMSISDN)) return sendEncryptedError(res, clientPublicKey, "Invalid Merchant Phone Number");
//     if (!isValidNumber(code)) return sendEncryptedError(res, clientPublicKey, "Invalid Code");

//     // 3️⃣ إرسال الطلب الأصلي
//     const response = await axios.post(`${BASE_API_URL}/api/clients/get-token`, {
//       programmName,
//       companyName,
//       merchantMSISDN,
//       code,
//     });

//     // 4️⃣ تشفير الاستجابة
//     const encryptedResponse = encryptHybrid(JSON.stringify(response.data), clientPublicKey);
//     return res.status(200).json(encryptedResponse);

//   } catch (error) {
//     console.error("Error in getToken:", error);

//     const clientPublicKey = req.session?.clientPublicKey;

//     if (error.response && clientPublicKey) {
//       const encryptedError = encryptHybrid(JSON.stringify(error.response.data), clientPublicKey);
//       return res.status(error.response.status).json(encryptedError);
//     }

//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// const getToken = async (req, res) => {
//   const serverPrivateKey = req.session?.serverPrivateKey;
//   const clientPublicKey = req.session?.clientPublicKey;

//   if (!serverPrivateKey || !clientPublicKey) {
//     return res.status(401).json({ message: 'Missing encryption keys in session' });
//   }

//   const encryptedBody = req.body;

//   // 1️⃣ فك التشفير
//   let decryptedData;
//   try {
//     decryptedData = JSON.parse(decryptHybrid(encryptedBody, serverPrivateKey));
//   } catch (e) {
//     console.error("Decryption failed:", e);
//     return sendEncryptedError(res, clientPublicKey, "Invalid encrypted payload", 400);
//   }

//   const { companyName, programmName, merchantMSISDN, code } = decryptedData;

//   // 2️⃣ التحقق من البيانات
//   if (!isValidString(companyName)) return sendEncryptedError(res, clientPublicKey, "Invalid CompanyName");
//   if (!isValidString(programmName)) return sendEncryptedError(res, clientPublicKey, "Invalid ProgrammName");
//   if (!validateMerchantPhoneNumber(merchantMSISDN)) return sendEncryptedError(res, clientPublicKey, "Invalid Merchant Phone Number");
//   if (!isValidNumber(code)) return sendEncryptedError(res, clientPublicKey, "Invalid Code");

//   try {
//     // 3️⃣ إرسال الطلب الأصلي
//     const response = await axios.post(`${BASE_API_URL}/api/clients/get-token`, {
//       programmName,
//       companyName,
//       merchantMSISDN,
//       code,
//     });

//     // 4️⃣ تشفير الرد
//     const encryptedResponse = encryptHybrid(JSON.stringify(response.data), clientPublicKey);
//     return res.status(200).json(encryptedResponse);

//   } catch (error) {
//   // console.error("Error in getToken:", error);

//   const errMsg =
//     error.response?.data?.message ||
//     error.response?.data?.errorDesc

//   if (error.response && clientPublicKey) {
//     return sendEncryptedError(res, clientPublicKey, errMsg, error.response.status);
//   }

//   if (clientPublicKey) {
//     return sendEncryptedError(res, clientPublicKey, "Internal Server Error", 500);
//   }

//   return res.status(500).json({ message: 'Internal Server Error' });
// }
// };


const saveServer = (req,res) => {
    try{
        return res.status(200).json({message : "server is running"});

    }catch(error){
        return res.status(400).json({message : "something went wrong" , error})
    }
}

const getToken = async (req, res) => {
  const encryptedBody = req.body;

  let decryptedData;
  let pageID = encryptedBody.pageID; // ✅ خذ pageID مباشرة من خارج البيانات المشفّرة

  if (!pageID) {
    return res.status(400).json({ message: "Missing page ID" });
  }

  let transaction;
  let clientPublicKey;
  let serverPrivateKey;

  // 🧩 ابحث عن المعاملة
  try {
    transaction = await paymentData.findOne({
      $or: [
        { "publicIDs.phonePage": pageID },
        { "publicIDs.otpPage": pageID }
      ]
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    clientPublicKey = transaction.clientPublicKey;
    serverPrivateKey = transaction.serverPrivateKey;

    if (!clientPublicKey || !serverPrivateKey) {
      return sendEncryptedError(res, clientPublicKey, "Missing encryption keys", 401);
    }
  } catch (e) {
    console.error("DB error:", e);
    return res.status(500).json({ message: "Database error" });
  }

  // 🔓 فك تشفير الطلب
  try {
    decryptedData = JSON.parse(decryptHybrid(encryptedBody, serverPrivateKey));

    // تحقق أن pageID داخل الرسالة المشفّرة يطابق الخارجي
    if (decryptedData.pageID !== pageID) {
      return sendEncryptedError(res, clientPublicKey, "Mismatched page ID", 400);
    }
  } catch (e) {
    console.error("Decryption failed:", e);
    return sendEncryptedError(res, clientPublicKey, "Invalid encrypted payload", 400);
  }

  const { companyName, programmName, merchantMSISDN, code } = decryptedData;

  // ✅ تحقق من القيم
  if (!isValidString(companyName)) return sendEncryptedError(res, clientPublicKey, "Invalid CompanyName");
  if (!isValidString(programmName)) return sendEncryptedError(res, clientPublicKey, "Invalid ProgrammName");
  if (!validateMerchantPhoneNumber(merchantMSISDN)) return sendEncryptedError(res, clientPublicKey, "Invalid Merchant Phone Number");
  if (!isValidNumber(code)) return sendEncryptedError(res, clientPublicKey, "Invalid Code");

  try {
    const response = await axios.post(`${BASE_API_URL}/api/clients/get-token`, {
      programmName,
      companyName,
      merchantMSISDN,
      code,
    });

    const encryptedResponse = encryptHybrid(JSON.stringify(response.data), clientPublicKey);
    return res.status(200).json(encryptedResponse);

  } catch (error) {
    const errMsg =
      error.response?.data?.message ||
      error.response?.data?.errorDesc;

    if (clientPublicKey) {
      return sendEncryptedError(res, clientPublicKey, errMsg || "Internal Server Error", error.response?.status || 500);
    }

    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


// const paymentRequest = async (req, res) => {
//   try {
//     // const { transactionID } = req.session.paymentData;
//     const { code, customerMSISDN, merchantMSISDN, amount, token , transactionID } = req.body;

//     // if (!transactionID) return res.status(400).json({ message: "Session expired or missing transaction ID" });
//     if (!isValidNumber(code)) return res.status(400).json({ message: "Invalid Code" });
//     if (!validateMerchantPhoneNumber(merchantMSISDN)) return res.status(400).json({ message: "Invalid Merchant Phone Number" });
//     if (!validateCustomerPhoneNumber(customerMSISDN)) return res.status(400).json({ message: "Invalid Customer Phone Number" });
//     if (!isValidAmount(amount)) return res.status(400).json({ message: "Invalid Amount" });

//     const response = await axios.post(`${BASE_API_URL}/api/clients/payment-request`, {
//       code,
//       customerMSISDN,
//       merchantMSISDN,
//       transactionID,
//       amount,
//       token,
//     });

//     if (response.data.details.otp) {
//     req.session.transactions = req.session.transactions || {};

//     if (req.session.transactions[transactionID]) {
//       req.session.transactions[transactionID].otp = response.data.details.otp;
//     }
//   }


//     return res.status(response.status).json(response.data);
//   } catch (error) {
//     if (error.response) return res.status(error.response.status).json(error.response.data);
//     console.error("Error forwarding request:", error.message);
//   }
// };


// const paymentRequest = async (req, res) => {
//       const serverPrivateKey = req.session?.serverPrivateKey;
//     const clientPublicKey = req.session?.clientPublicKey;
//   try {

//     if (!serverPrivateKey || !clientPublicKey) {
//       return res.status(401).json({ message: 'Missing encryption keys' });
//     }

//     // 🔓 فك التشفير
//     let decryptedData;
//     try {
//       decryptedData = JSON.parse(decryptHybrid(req.body, serverPrivateKey));
//     } catch (err) {
//       console.error("Failed to decrypt request:", err);
//       return res.status(400).json(encryptHybrid(JSON.stringify({ message: "Invalid encrypted request" }), clientPublicKey));
//     }

//     const { code, customerMSISDN, merchantMSISDN, amount, token, transactionID } = decryptedData;

//   if (!isValidNumber(code)) return sendEncryptedError(res, clientPublicKey, "Invalid Code");
//   if (!validateMerchantPhoneNumber(merchantMSISDN)) return sendEncryptedError(res, clientPublicKey, "Invalid Merchant Phone Number");
//     if (!validateCustomerPhoneNumber(customerMSISDN)) return sendEncryptedError(res, clientPublicKey, "Invalid Customer Phone Number");
//     if (!isValidAmount(amount)) return sendEncryptedError(res, clientPublicKey, "Invalid amount");

//     const response = await axios.post(`${BASE_API_URL}/api/clients/payment-request`, {
//       code,
//       customerMSISDN,
//       merchantMSISDN,
//       transactionID,
//       amount,
//       token,
//     });

//     // 🧠 خزّن OTP إن وجد
//     if (response.data.details?.otp && req.session.transactions?.[transactionID]) {
//       req.session.transactions[transactionID].otp = response.data.details.otp;
//     }

//     console.log(req.session.transactions[transactionID])

//     // 🔐 تشفير الرد قبل الإرسال
//     const encryptedResponse = encryptHybrid(JSON.stringify(response.data), clientPublicKey);
//     return res.status(response.status).json(encryptedResponse);
    
//   } catch (error) {
//   // console.error("Error in getToken:", error);

//   const errMsg =
//     error.response?.data?.message ||
//     error.response?.data?.errorDesc

//   if (error.response && clientPublicKey) {
//     return sendEncryptedError(res, clientPublicKey, errMsg, error.response.status);
//   }

//   if (clientPublicKey) {
//     return sendEncryptedError(res, clientPublicKey, "Internal Server Error", 500);
//   }

//   return res.status(500).json({ message: 'Internal Server Error' });
// }
// };

const paymentRequest = async (req, res) => {
  const encryptedBody = req.body;

  const pageID = encryptedBody.pageID;
  if (!pageID) {
    return res.status(400).json({ message: "Missing page ID" });
  }

  let transaction;
  let clientPublicKey;
  let serverPrivateKey;

  // 🔍 ابحث عن مفاتيح التشفير من قاعدة البيانات
  try {
    transaction = await paymentData.findOne({
      $or: [
        { "publicIDs.phonePage": pageID },
        { "publicIDs.otpPage": pageID }
      ]
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    clientPublicKey = transaction.clientPublicKey;
    serverPrivateKey = transaction.serverPrivateKey;

    if (!clientPublicKey || !serverPrivateKey) {
      return sendEncryptedError(res, clientPublicKey, "Missing encryption keys", 401);
    }
  } catch (e) {
    console.error("DB error:", e);
    return res.status(500).json({ message: "Database error" });
  }

  // 🔓 فك التشفير باستخدام المفتاح الخاص
  let decryptedData;
  try {
    decryptedData = JSON.parse(decryptHybrid(encryptedBody, serverPrivateKey));

    // تحقق من تطابق pageID
    if (decryptedData.pageID !== pageID) {
      return sendEncryptedError(res, clientPublicKey, "Mismatched page ID", 400);
    }
  } catch (err) {
    console.error("Decryption failed:", err);
    return res.status(400).json(encryptHybrid(JSON.stringify({ message: "Invalid encrypted request" }), clientPublicKey));
  }console.log("🔓 Decrypted data on server:", decryptedData);

  console.log("🔓 Decrypted data on server:", decryptedData);


  const { code, customerMSISDN, merchantMSISDN, amount, token, transactionID } = decryptedData;

  // ✅ تحقق من القيم
  if (!isValidNumber(code)) return sendEncryptedError(res, clientPublicKey, "Invalid Code");
  if (!validateMerchantPhoneNumber(merchantMSISDN)) return sendEncryptedError(res, clientPublicKey, "Invalid Merchant Phone Number");
  if (!validateCustomerPhoneNumber(customerMSISDN)) return sendEncryptedError(res, clientPublicKey, "Invalid Customer Phone Number");
  if (!isValidAmount(amount)) return sendEncryptedError(res, clientPublicKey, "Invalid amount");

  // 🧾 أرسل الطلب إلى سيرفر الدفع
  try {
    const response = await axios.post(`${BASE_API_URL}/api/clients/payment-request`, {
      code,
      customerMSISDN,
      merchantMSISDN,
      transactionID,
      amount,
      token,
    });

    // 🧠 خزّن OTP إذا وُجد
   if (response.data.details?.otp && transactionID) {
  await paymentData.updateOne(
    { _id: transaction._id },
    {
      $set: {
        otp: response.data.details.otp,
        customerMSISDN // 👈 أضف هذا
      }
    }
  );
}

    // 🔐 شفر الرد وأرسله
    const encryptedResponse = encryptHybrid(JSON.stringify(response.data), clientPublicKey);
    return res.status(response.status).json(encryptedResponse);

  } catch (error) {
    console.error("Payment error:", error?.response?.data || error.message);

    const errMsg =
      error.response?.data?.message ||
      error.response?.data?.errorDesc ||
      "Internal Server Error";

    return sendEncryptedError(res, clientPublicKey, errMsg, error.response?.status || 500);
  }
};

// const paymentConfirmation = async (req, res) => {
//   try {
//     // const { transactionID } = req.session.paymentData;
//     const { code, merchantMSISDN, OTP, token , transactionID } = req.body;

//     if (!transactionID) return res.status(400).json({ message: "Session expired or missing transaction ID" });
//     if (!isValidNumber(code)) return res.status(400).json({ message: "Invalid Code" });
//     if (!validateMerchantPhoneNumber(merchantMSISDN)) return res.status(400).json({ message: "Invalid Merchant Phone Number" });
//     if (!isValidOTP(OTP)) return res.status(400).json({ message: "Invalid OTP" });

//     const response = await axios.post(`${BASE_API_URL}/api/clients/payment-confirmation`, {
//       code,
//       transactionID,
//       merchantMSISDN,
//       OTP,
//       token,
//     });

//     return res.status(response.status).json(response.data);
//   } catch (error) {
//     if (error.response) return res.status(error.response.status).json(error.response.data);
//     console.error("Error forwarding request:", error.message);
//   }
// };

// const paymentConfirmation = async (req, res) => {
//       const serverPrivateKey = req.session?.serverPrivateKey;
//     const clientPublicKey = req.session?.clientPublicKey;
//   try {

//     if (!serverPrivateKey || !clientPublicKey) {
//       return res.status(401).json({ message: 'Missing encryption keys' });
//     }

//     // 🔓 فك التشفير
//     let decryptedData;
//     try {
//       decryptedData = JSON.parse(decryptHybrid(req.body, serverPrivateKey));
//       console.log("🔓 Decrypted payment confirmation data:", decryptedData);
//     } catch (err) {
//       console.error("❌ Failed to decrypt payment confirmation request:", err);
//       return  sendEncryptedError(res, clientPublicKey, "Invalid encrypted request");
//     }

//     const { code, merchantMSISDN, OTP, token, transactionID } = decryptedData;

//     // ✅ التحقق من البيانات
//     if (!transactionID) return sendEncryptedError(res, clientPublicKey, "Missing transaction ID");
//     if (!isValidNumber(code)) return sendEncryptedError(res, clientPublicKey, "Invalid Code");
//     if (!validateMerchantPhoneNumber(merchantMSISDN)) return sendEncryptedError(res, clientPublicKey, "Invalid Merchant Phone Number");
//     if (!isValidOTP(OTP)) return sendEncryptedError(res, clientPublicKey, "Invalid Otp");;

//     // 📨 إرسال الطلب إلى Syritel
//     const response = await axios.post(`${BASE_API_URL}/api/clients/payment-confirmation`, {
//       code,
//       transactionID,
//       merchantMSISDN,
//       OTP,
//       token,
//     });

//     // 🔐 تشفير الرد قبل الإرسال
//     const encryptedResponse = encryptHybrid(JSON.stringify(response.data), clientPublicKey);
//     return res.status(response.status).json(encryptedResponse);

//   } catch (error) {
//   // console.error("Error in getToken:", error);

//   const errMsg =
//     error.response?.data?.message ||
//     error.response?.data?.errorDesc

//   if (error.response && clientPublicKey) {
//     return sendEncryptedError(res, clientPublicKey, errMsg, error.response.status);
//   }

//   if (clientPublicKey) {
//     return sendEncryptedError(res, clientPublicKey, "Internal Server Error", 500);
//   }

//   return res.status(500).json({ message: 'Internal Server Error' });
// }
// };

const paymentConfirmation = async (req, res) => {
  const encryptedBody = req.body;
  const pageID = encryptedBody.pageID; // ✅ ناخد pageID خارج البيانات المشفّرة

  if (!pageID) {
    return res.status(400).json({ message: 'Missing page ID' });
  }

  let transaction;
  let clientPublicKey;
  let serverPrivateKey;

  // 🔎 ابحث عن المعاملة بالمخزن
  try {
    transaction = await paymentData.findOne({
      $or: [
        { "publicIDs.phonePage": pageID },
        { "publicIDs.otpPage": pageID }
      ]
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    clientPublicKey = transaction.clientPublicKey;
    serverPrivateKey = transaction.serverPrivateKey;

    if (!clientPublicKey || !serverPrivateKey) {
      return sendEncryptedError(res, clientPublicKey, "Missing encryption keys", 401);
    }
  } catch (e) {
    console.error("DB error:", e);
    return res.status(500).json({ message: "Database error" });
  }

  // 🔓 فك التشفير
  let decryptedData;
  try {
    decryptedData = JSON.parse(decryptHybrid(encryptedBody, serverPrivateKey));
    console.log("🔓 Decrypted payment confirmation data:", decryptedData);

    if (decryptedData.pageID !== pageID) {
      return sendEncryptedError(res, clientPublicKey, "Mismatched page ID", 400);
    }
  } catch (err) {
    console.error("❌ Failed to decrypt payment confirmation request:", err);
    return sendEncryptedError(res, clientPublicKey, "Invalid encrypted request");
  }

  const { code, merchantMSISDN, OTP, token, transactionID } = decryptedData;

  // ✅ التحقق من البيانات
  if (!transactionID) return sendEncryptedError(res, clientPublicKey, "Missing transaction ID");
  if (!isValidNumber(code)) return sendEncryptedError(res, clientPublicKey, "Invalid Code");
  if (!validateMerchantPhoneNumber(merchantMSISDN)) return sendEncryptedError(res, clientPublicKey, "Invalid Merchant Phone Number");
  if (!isValidOTP(OTP)) return sendEncryptedError(res, clientPublicKey, "Invalid OTP");

  try {
    // 📨 أرسل البيانات لـ Syriatel
    const response = await axios.post(`${BASE_API_URL}/api/clients/payment-confirmation`, {
      code,
      transactionID,
      merchantMSISDN,
      OTP,
      token,
    });

    // ✅ تحديث successPayment = true
      await paymentData.updateOne(
        { _id: transaction._id },
        { $set: { paymentSuccess: true } }
      );


    // 🔐 تشفير الرد
    const encryptedResponse = encryptHybrid(JSON.stringify(response.data), clientPublicKey);
    return res.status(response.status).json(encryptedResponse);

  } catch (error) {
    const errMsg =
      error.response?.data?.message ||
      error.response?.data?.errorDesc;

    if (error.response && clientPublicKey) {
      return sendEncryptedError(res, clientPublicKey, errMsg, error.response.status);
    }

    if (clientPublicKey) {
      return sendEncryptedError(res, clientPublicKey, "Internal Server Error", 500);
    }

    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// const resendOTP = async (req, res) => {
//   try {
//     // const { transactionID } = req.session.paymentData;
//     const { code, merchantMSISDN, token , transactionID } = req.body;

//     if (!transactionID) return res.status(400).json({ message: "Session expired or missing transaction ID" });
//     if (!isValidNumber(code)) return res.status(400).json({ message: "Invalid Code" });
//     if (!validateMerchantPhoneNumber(merchantMSISDN)) return res.status(400).json({ message: "Invalid Merchant Phone Number" });

//     const response = await axios.post(`${BASE_API_URL}/api/clients/resend-otp`, {
//       code,
//       transactionID,
//       merchantMSISDN,
//       token,
//     });

//     return res.status(response.status).json(response.data);
//   } catch (error) {
//     if (error.response) return res.status(error.response.status).json(error.response.data);
//     console.error("Error forwarding request:", error.message);
//   }
// };

const resendOTP = async (req, res) => {
  const encryptedBody = req.body;
  const pageID = encryptedBody.pageID; // ✅ ناخذ pageID خارج التشفير

  if (!pageID) {
    return res.status(400).json({ message: 'Missing page ID' });
  }

  let transaction;
  let clientPublicKey;
  let serverPrivateKey;

  // 🔍 ابحث عن المعاملة باستخدام pageID
  try {
    transaction = await paymentData.findOne({
      $or: [
        { "publicIDs.phonePage": pageID },
        { "publicIDs.otpPage": pageID }
      ]
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    clientPublicKey = transaction.clientPublicKey;
    serverPrivateKey = transaction.serverPrivateKey;

    if (!clientPublicKey || !serverPrivateKey) {
      return sendEncryptedError(res, clientPublicKey, "Missing encryption keys", 401);
    }
  } catch (e) {
    console.error("Database error:", e);
    return res.status(500).json({ message: "Database error" });
  }

  // 🔓 فك التشفير
  let decryptedData;
  try {
    const decryptedString = decryptHybrid(encryptedBody, serverPrivateKey);
    console.log("🔓 Decrypted resendOTP data:", decryptedString);
    decryptedData = JSON.parse(decryptedString);

    // ✅ تحقق من تطابق pageID داخل التشفير مع الخارجي
    if (decryptedData.pageID !== pageID) {
      return sendEncryptedError(res, clientPublicKey, "Mismatched page ID", 400);
    }
  } catch (err) {
    console.error("❌ Decryption failed in resendOTP:", err);
    return sendEncryptedError(res, clientPublicKey, "Invalid encrypted payload");
  }

  const { code, merchantMSISDN, token, transactionID } = decryptedData;

  // ✅ التحقق من البيانات
  if (!transactionID) return sendEncryptedError(res, clientPublicKey, "Missing transaction ID");
  if (!isValidNumber(code)) return sendEncryptedError(res, clientPublicKey, "Invalid Code");
  if (!validateMerchantPhoneNumber(merchantMSISDN)) return sendEncryptedError(res, clientPublicKey, "Invalid Merchant Phone Number");

  try {
    // 📡 إرسال الطلب إلى Syritel
    const response = await axios.post(`${BASE_API_URL}/api/clients/resend-otp`, {
      code,
      transactionID,
      merchantMSISDN,
      token,
    });

    // 🔐 تشفير الرد
    const encryptedResponse = encryptHybrid(JSON.stringify(response.data), clientPublicKey);
    return res.status(response.status).json(encryptedResponse);

  } catch (error) {
    const errMsg =
      error.response?.data?.message ||
      error.response?.data?.errorDesc;

    if (error.response && clientPublicKey) {
      return sendEncryptedError(res, clientPublicKey, errMsg, error.response.status);
    }

    if (clientPublicKey) {
      return sendEncryptedError(res, clientPublicKey, "Internal Server Error", 500);
    }

    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// const getRedirctUrl = async (req, res) => {
//   try {
//     // const { transactionID } = req.session.paymentData;
//     const { code, companyName, programmName } = req.body;
//     if(!code || !companyName || !programmName) return res.status(400).json({message : "All fields are required."});
//     if (!isValidString(companyName)) return res.status(400).json({ message: "Invalid CompanyName" });
//     if (!isValidString(programmName)) return res.status(400).json({ message: "Invalid ProgrammName" });
//     if (!isValidNumber(code)) return res.status(400).json({ message: "Invalid Code" });

//     const response = await axios.post(`${BASE_API_URL}/api/clients/get-url`, {
//         companyName,
//         programmName,
//         code
//     });

//     return res.status(response.status).json(response.data);
//   } catch (error) {
//     if (error.response) return res.status(error.response.status).json(error.response.data);
//     console.error("Error forwarding request:", error.message);
//   }
// };

const getRedirctUrl = async (req, res) => {
  const encryptedBody = req.body;
  const pageID = req.body.pageID;

  if (!pageID) {
    return res.status(400).json({ message: 'Missing page ID' });
  }

  let transaction;
  let clientPublicKey;
  let serverPrivateKey;

  // 📦 جلب المفاتيح من قاعدة البيانات
  try {
    transaction = await paymentData.findOne({
      $or: [
        { "publicIDs.phonePage": pageID },
        { "publicIDs.otpPage": pageID }
      ]
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    clientPublicKey = transaction.clientPublicKey;
    serverPrivateKey = transaction.serverPrivateKey;

    if (!clientPublicKey || !serverPrivateKey) {
      return sendEncryptedError(res, clientPublicKey, "Missing encryption keys", 401);
    }
  } catch (e) {
    console.error("❌ Database error:", e);
    return res.status(500).json({ message: "Database error" });
  }

  // 🔓 فك التشفير
  let decryptedData;
  try {
    const decryptedString = decryptHybrid(encryptedBody, serverPrivateKey);
    console.log("🔓 Decrypted getRedirctUrl data:", decryptedString);
    decryptedData = JSON.parse(decryptedString);

    if (decryptedData.pageID !== pageID) {
      return sendEncryptedError(res, clientPublicKey, "Mismatched page ID", 400);
    }
  } catch (err) {
    console.error("❌ Decryption failed in getRedirctUrl:", err);
    return sendEncryptedError(res, clientPublicKey, "Invalid encrypted payload", 400);
  }

  const { code, companyName, programmName } = decryptedData;

  // ✅ التحقق من البيانات
  if (!code || !companyName || !programmName) {
    return sendEncryptedError(res, clientPublicKey, "All fields are required.");
  }
  if (!isValidString(companyName)) {
    return sendEncryptedError(res, clientPublicKey, "Invalid CompanyName");
  }
  if (!isValidString(programmName)) {
    return sendEncryptedError(res, clientPublicKey, "Invalid ProgrammName");
  }
  if (!isValidNumber(code)) {
    return sendEncryptedError(res, clientPublicKey, "Invalid Code");
  }

  try {
    // 📡 إرسال الطلب إلى Syritel
    const response = await axios.post(`${BASE_API_URL}/api/clients/get-url`, {
      companyName,
      programmName,
      code,
    });

    // 🔐 تشفير الرد
    const encryptedResponse = encryptHybrid(JSON.stringify(response.data), clientPublicKey);
    return res.status(response.status).json(encryptedResponse);

  } catch (error) {
    const errMsg =
      error.response?.data?.message ||
      error.response?.data?.errorDesc;

    if (error.response && clientPublicKey) {
      return sendEncryptedError(res, clientPublicKey, errMsg, error.response.status);
    }

    if (clientPublicKey) {
      return sendEncryptedError(res, clientPublicKey, "Internal Server Error", 500);
    }

    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

// const getUrl = (req, res) => {
//   const { companyName, programmName, code, merchantMSISDN, amount } = req.body;
//   const isDevRequest = req.headers["x-dev-request"] === "true";

//   if (!isValidString(companyName)) return isDevRequest ? res.status(400).json({ message: "Invalid CompanyName" }) : res.status(204).end();
//   if (!isValidString(programmName)) return isDevRequest ? res.status(400).json({ message: "Invalid ProgrammName" }) : res.status(204).end();
//   if (!isValidNumber(code)) return isDevRequest ? res.status(400).json({ message: "Invalid Code" }) : res.status(204).end();
//   if (!validateMerchantPhoneNumber(merchantMSISDN)) return isDevRequest ? res.status(400).json({ message: "Invalid Merchant Phone Number" }) : res.status(204).end();
//   if (!isValidAmount(amount)) return isDevRequest ? res.status(400).json({ message: "Invalid Amount" }) : res.status(204).end();

//   const transactionID = uuidv4();

//   // خزّن كل العمليات في session
//   req.session.transactions = req.session.transactions || {};
//   req.session.transactions[transactionID] = {
//     companyName,
//     programmName,
//     code,
//     transactionID,
//     merchantMSISDN,
//     amount,
//     otp: null
//   };

//   const baseUrl = `${req.protocol}://${req.get("host")}`;
//   const redirectUrl = `${baseUrl}/api/clients/customerPhone-page/${transactionID}`;

//   res.json({ url: redirectUrl });
// };


// const getUrl = (req, res) => {
//   const { companyName, programmName, code, merchantMSISDN, amount } = req.body;
//   const isDevRequest = req.headers["x-dev-request"] === "true";

//   if (!isValidString(companyName)) return isDevRequest ? res.status(400).json({ message: "Invalid CompanyName" }) : res.status(204).end();
//   if (!isValidString(programmName)) return isDevRequest ? res.status(400).json({ message: "Invalid ProgrammName" }) : res.status(204).end();
//   if (!isValidNumber(code)) return isDevRequest ? res.status(400).json({ message: "Invalid Code" }) : res.status(204).end();
//   if (!validateMerchantPhoneNumber(merchantMSISDN)) return isDevRequest ? res.status(400).json({ message: "Invalid Merchant Phone Number" }) : res.status(204).end();
//   if (!isValidAmount(amount)) return isDevRequest ? res.status(400).json({ message: "Invalid Amount" }) : res.status(204).end();

//   // UUIDs
//   const transactionID = uuidv4();               // داخلي
//   const publicID_phonePage = uuidv4();          // لصفحة رقم الهاتف
//   const publicID_otpPage = uuidv4();            // لصفحة OTP

//   // إعداد session maps
//   req.session.transactions = req.session.transactions || {};
//   req.session.publicTransactionMap = req.session.publicTransactionMap || {};

//   // خزّن البيانات كاملة
//   req.session.transactions[transactionID] = {
//     companyName,
//     programmName,
//     code,
//     transactionID,
//     merchantMSISDN,
//     amount,
//     otp: null
//   };

//   // اربط كل publicID بـ transactionID
//   req.session.publicTransactionMap[publicID_phonePage] = transactionID;
//   req.session.publicTransactionMap[publicID_otpPage] = transactionID;

//   const baseUrl = `${req.protocol}://${req.get("host")}`;
//   const redirectUrl = `${baseUrl}/api/clients/customerPhone-page/${publicID_phonePage}`;

//   // أرسل كمان الـ publicID الثاني إذا بدك تستخدمه لاحقاً
//   res.json({ url: redirectUrl, otpPageID: publicID_otpPage });
// };

// const customerPhonePage = (req, res) => {
//   const { publicID } = req.params;

//   const transactionID = req.session.publicTransactionMap?.[publicID];
//   const data = req.session.transactions?.[transactionID];

//   if (!transactionID || !data) return res.status(404).send("Transaction not found");

//   // خزن transactionID مؤقتاً لجلب البيانات
//   req.session.currentTransactionID = transactionID;

//   res.render("pages/customerPhone/customerPhone", { data });
// };

// const otpVerificationPage = (req, res) => {
//   const { publicID } = req.params;

//   const transactionID = req.session.publicTransactionMap?.[publicID];
//   const data = req.session.transactions?.[transactionID];

//   if (!transactionID || !data) return res.status(404).send("Transaction not found or expired");

//   req.session.currentTransactionID = transactionID;

//   res.render("pages/otpVerification/otpVerification", { data });
// };

// const getPaymentData = (req, res) => {
//   const publicID = req.headers["x-page-id"]; // هذا ال UUID الفريد يلي بعتو من كل صفحة

//   // تحقق من وجود الـ publicID و الـ session
//   if (!publicID || !req.session.publicTransactionMap) {
//     return res.status(401).json({ message: "Missing or invalid page identifier" });
//   }

//   const transactionID = req.session.publicTransactionMap[publicID];

//   if (!transactionID || !req.session.transactions?.[transactionID]) {
//     return res.status(401).json({ message: "Unauthorized or invalid transaction" });
//   }

//   const data = req.session.transactions[transactionID];

//   res.json(data);
// };

// const getPaymentData = (req, res) => {
//   const publicID = req.headers["x-page-id"]; // هذا ال UUID الفريد يلي بعتو من كل صفحة

//   // تحقق من وجود الـ publicID و الـ session
//   if (!publicID || !req.session.publicTransactionMap) {
//     return res.status(401).json({ message: "Missing or invalid page identifier" });
//   }

//   const transactionID = req.session.publicTransactionMap[publicID];

//   if (!transactionID || !req.session.transactions?.[transactionID]) {
//     return res.status(401).json({ message: "Unauthorized or invalid transaction" });
//   }

//   const data = req.session.transactions[transactionID];

//   res.json(data);
// };



// const customerPhonePage =  (req, res) => {
//   // const { transactionID } = req.params;
//   // const data = req.session.transactions?.[transactionID];

//   // if (!data) return res.status(404).send("Transaction not found");

//   res.render("pages/customerPhone/customerPhone");
// };

// const customerPhonePage = (req, res) => {
//   const { publicID } = req.params;

//   const transactionID = req.session.publicTransactionMap?.[publicID];
//   const data = req.session.transactions?.[transactionID];

//   if (!transactionID || !data) {
//     return res.status(404).send("Transaction not found");
//   }

//   // نخزن الـ transactionID حاليًا للاستخدام ببقية الصفحات
//   req.session.currentTransactionID = transactionID;

//   res.render("pages/customerPhone/customerPhone", { data });
// };

// const otpVerificationPage = (req, res) => {

//   res.render("pages/otpVerification/otpVerification");
// };

// const getPaymentData = (req, res) => {
//   const { transactionID } = req.query;

//   if (!transactionID || !req.session.transactions?.[transactionID]) {
//     return res.status(401).json({ message: "Unauthorized or invalid transaction" });
//   }

//   res.json(req.session.transactions[transactionID]);
// };

// إزالة getBaseURL لأنه يعتمد على Vault
// const getBaseURL = ...


// const getUrl = (req, res) => {
//   const clientPublicKey = req.session?.clientPublicKey;
//   const { companyName, programmName, code, merchantMSISDN, amount } = req.body;
//   const isDevRequest = req.headers["x-dev-request"] === "true";

//   if (!isValidString(companyName)) return isDevRequest ? sendEncryptedError(res, clientPublicKey, "Invalid CompanyName") : res.status(204).end();
//   if (!isValidString(programmName)) return isDevRequest ? sendEncryptedError(res, clientPublicKey, "Invalid ProgrammName") : res.status(204).end();
//   if (!isValidNumber(code)) return isDevRequest ? sendEncryptedError(res, clientPublicKey, "Invalid Code") : res.status(204).end();
//   if (!validateMerchantPhoneNumber(merchantMSISDN)) return isDevRequest ? sendEncryptedError(res, clientPublicKey, "Invalid Merchant Phone Number") : res.status(204).end();
//   if (!isValidAmount(amount)) return isDevRequest ? sendEncryptedError(res, clientPublicKey, "Invalid Amount") : res.status(204).end();

//   const transactionID = uuidv4();
//   const publicID_phonePage = uuidv4();
//   const publicID_otpPage = uuidv4();

//   // تأكد من وجود الجلسة المطلوبة
//   req.session.transactions ??= {};
//   req.session.publicTransactionMap ??= {};

//   // تخزين تفاصيل المعاملة (بدون تشفير في هذه المرحلة، يمكن التشفير لاحقًا عند الإرسال)
//   req.session.transactions[transactionID] = {
//     companyName,
//     programmName,
//     code,
//     transactionID,
//     merchantMSISDN,
//     amount,
//     otp: null
//   };

//   // ربط المعرفات العامة بالمعاملة
//   req.session.publicTransactionMap[publicID_phonePage] = transactionID;
//   req.session.publicTransactionMap[publicID_otpPage] = transactionID;

//   const baseUrl = `${req.protocol}://${req.get("host")}`;
//   const redirectUrl = `${baseUrl}/api/clients/customerPhone-page/${publicID_phonePage}`;

//   return res.json({ url: redirectUrl });
// };

const getUrl = async (req, res) => {
  const { clientPublicKey } = req.body;
  const { companyName, programmName, code, merchantMSISDN, amount } = req.body;
  const isDevRequest = req.headers["x-dev-request"] === "true";

  if (!isValidString(companyName)) return isDevRequest ? res.status(400).json({message : "Invalid CompanyName"}) : res.status(204).end();
  if (!isValidString(programmName)) return isDevRequest ? res.status(400).json({message : "Invalid ProgrammName"}) : res.status(204).end();
  if (!isValidNumber(code)) return isDevRequest ? res.status(400).json({message : "Invalid Code"}) : res.status(204).end();
  if (!validateMerchantPhoneNumber(merchantMSISDN)) return isDevRequest ? res.status(400).json({message : "Invalid Merchant Phone Number"}) : res.status(204).end();
  if (!isValidAmount(amount)) return isDevRequest ? res.status(400).json({message : "Invalid Amount"}) : res.status(204).end();

  const transactionID = uuidv4();
  const publicID_phonePage = uuidv4();
  const publicID_otpPage = uuidv4();

  // const serverPrivateKey = generateServerPrivateKey(); // استخدم طريقتك لتوليد مفتاح RSA

  try {
    await paymentData.create({
      transactionID,
      companyName,
      programmName,
      code,
      merchantMSISDN,
      customerMSISDN : null,
      amount,
      otp: null,
      publicIDs: {
        phonePage: publicID_phonePage,
        otpPage: publicID_otpPage
      },
      clientPublicKey : null,
      serverPrivateKey :null,
      createdAt: new Date()
    });

    const baseUrl = `https://projecttwo-iqjp.onrender.com`;
    const redirectUrl = `${baseUrl}/api/clients/customerPhone-page/${publicID_phonePage}`;
    return res.json({ url: redirectUrl });

  } catch (err) {
    console.error("MongoDB Error:", err);
    return res.status(500).json({message : "Internal server error"});
  }
};

// عرض صفحة إدخال رقم الهاتف
// const customerPhonePage = (req, res) => {
//   const { publicID } = req.params; 
//   const transactionID = req.session.publicTransactionMap?.[publicID];
//   const data = req.session.transactions?.[transactionID];

//   if (!transactionID || !data) return res.status(404).send("Transaction not found");

//   // req.session.currentTransactionID = transactionID;
//   res.render("pages/customerPhone/customerPhone");
// };

const customerPhonePage = async (req, res) => {
  const { publicID } = req.params;

  try {
    // البحث في قاعدة البيانات عن المعاملة التي تحتوي على الـ publicID
    const transaction = await paymentData.findOne({
      $or: [
        { "publicIDs.phonePage": publicID },
        { "publicIDs.otpPage": publicID }
      ]
    });

    if (!transaction) {
      return res.status(404).send("Transaction not found");
    }

    // يمكنك تمرير بيانات إلى الصفحة إذا لزم الأمر (أو فقط publicID)
    res.render("pages/customerPhone/customerPhone");

  } catch (err) {
    console.error("MongoDB error:", err);
    return res.status(500).send("Server error");
  }
};


// const customerPhonePage = (req, res) => {
//   const { publicID } = req.params; 
//   const transactionID = req.session.publicTransactionMap?.[publicID];
//   const data = req.session.transactions?.[transactionID];

//   if (!transactionID || !data) return res.status(404).send("Transaction not found");

//   // 🔐 خزّن الـ transactionID الحالي للجلسة (مهم للـ OTP والعمليات القادمة)
//   req.session.currentTransactionID = transactionID;

//   res.render("pages/customerPhone/customerPhone");
// };

// عرض صفحة OTP
const otpVerificationPage = async(req, res) => {
  const { publicID } = req.params;

  try {
    // البحث في قاعدة البيانات عن المعاملة التي تحتوي على الـ publicID
    const transaction = await paymentData.findOne({
      $or: [
        { "publicIDs.phonePage": publicID },
        { "publicIDs.otpPage": publicID }
      ]
    });

    if (!transaction) {
      return res.status(404).send("Transaction not found");
    }

    // يمكنك تمرير بيانات إلى الصفحة إذا لزم الأمر (أو فقط publicID)
  res.render("pages/otpVerification/otpVerification");

  } catch (err) {
    console.error("MongoDB error:", err);
    return res.status(500).send("Server error");
  }

  // req.session.currentTransactionID = transactionID;
};

// جلب البيانات للـ Frontend (من publicID)
// const getPaymentData = (req, res) => {
//   const publicID = req.headers["x-page-id"];
//   if (!publicID) return res.status(400).json({ message: "Missing page ID" });

//   const transactionID = req.session.publicTransactionMap?.[publicID];
//   const data = req.session.transactions?.[transactionID];

//   if (!transactionID || !data) return res.status(404).json({ message: "Transaction not found" });

//   const otpPageID = Object.keys(req.session.publicTransactionMap).find(
//     (key) => req.session.publicTransactionMap[key] === transactionID && key !== publicID
//   );

//   res.json({ ...data, otpPageID });
// };

// const getPaymentData = (req, res) => {
//   const serverPrivateKey = req.session?.serverPrivateKey;
//   const clientPublicKey = req.session?.clientPublicKey;

//   if (!serverPrivateKey || !clientPublicKey) {
//     return res.status(401).json({ message: "Missing encryption keys in session" });
//   }

//   const { encryptedKey, iv, ciphertext, authTag } = req.body;

//   if (!encryptedKey || !iv || !ciphertext || !authTag) {
//     const fallback = encryptHybrid(JSON.stringify({ message: "Missing encrypted fields" }), clientPublicKey);
//     return res.status(400).json(fallback);
//   }

//   let decryptedRequest;
//   try {
//     decryptedRequest = JSON.parse(decryptHybrid({ encryptedKey, iv, ciphertext, authTag }, serverPrivateKey));
//   } catch (err) {
//     console.error("Decryption error:", err);
//     const fallback = encryptHybrid(JSON.stringify({ message: "Invalid encrypted payload" }), clientPublicKey);
//     return res.status(400).json(fallback);
//   }

//   const publicID = decryptedRequest?.pageID;
//   if (!publicID) {
//     const encrypted = encryptHybrid(JSON.stringify({ message: "Missing page ID" }), clientPublicKey);
//     return res.status(400).json(encrypted);
//   }

//   const transactionID = req.session.publicTransactionMap?.[publicID];
//   const data = req.session.transactions?.[transactionID];

//   if (!transactionID || !data) {
//     const encrypted = encryptHybrid(JSON.stringify({ message: "Transaction not found" }), clientPublicKey);
//     return res.status(404).json(encrypted);
//   }

//   const otpPageID = Object.keys(req.session.publicTransactionMap).find(
//     (key) => req.session.publicTransactionMap[key] === transactionID && key !== publicID
//   );

//   const payload = {
//     companyName: data.companyName,
//     programmName: data.programmName,
//     merchantMSISDN: data.merchantMSISDN,
//     amount: data.amount,
//     code: data.code,
//     transactionID: data.transactionID,
//     otpPageID
//   };

//   const encryptedResponse = encryptHybrid(JSON.stringify(payload), clientPublicKey);
//   return res.status(200).json(encryptedResponse);
// };

// const getPaymentData = (req, res) => {
//   const serverPrivateKey = req.session?.serverPrivateKey;
//   const clientPublicKey = req.session?.clientPublicKey;

//   if (!serverPrivateKey || !clientPublicKey) {
//     const encrypted = encryptHybrid(
//       JSON.stringify({ message: "Missing encryption keys in session" }),
//       clientPublicKey
//     );
//     return res.status(401).json(encrypted);
//   }

// const { encryptedAESKey, iv, ciphertext, authTag } = req.body;


//   if (!encryptedAESKey || !iv || !ciphertext || !authTag) {
//     const encrypted = encryptHybrid(
//       JSON.stringify({ message: "Missing encrypted fields" }),
//       clientPublicKey
//     );
//     return res.status(400).json(encrypted);
//   }

//   let decryptedRequest;
//   try {
//     decryptedRequest = JSON.parse(
//       decryptHybrid(
//         { encryptedAESKey, iv, ciphertext, authTag },
//         serverPrivateKey
//       )
//     );
//   } catch (err) {
//     console.error("Decryption error:", err);
//     const encrypted = encryptHybrid(
//       JSON.stringify({ message: "Invalid encrypted payload" }),
//       clientPublicKey
//     );
//     return res.status(400).json(encrypted);
//   }

//   const publicID = decryptedRequest?.pageID;
//   if (!publicID) {
//     const encrypted = encryptHybrid(
//       JSON.stringify({ message: "Missing page ID" }),
//       clientPublicKey
//     );
//     return res.status(400).json(encrypted);
//   }

//   const transactionID = req.session.publicTransactionMap?.[publicID];
//   const data = req.session.transactions?.[transactionID];

//   if (!transactionID || !data) {
//     const encrypted = encryptHybrid(
//       JSON.stringify({ message: "Transaction not found" }),
//       clientPublicKey
//     );
//     return res.status(404).json(encrypted);
//   }

//   const otpPageID = Object.keys(req.session.publicTransactionMap).find(
//     (key) => req.session.publicTransactionMap[key] === transactionID && key !== publicID
//   );

//   const payload = {
//     companyName: data.companyName,
//     programmName: data.programmName,
//     merchantMSISDN: data.merchantMSISDN,
//     amount: data.amount,
//     code: data.code,
//     transactionID: data.transactionID,
//     otp : data.otp,
//     otpPageID
//   };

//   const encryptedResponse = encryptHybrid(JSON.stringify(payload), clientPublicKey);
//   return res.status(200).json(encryptedResponse);
// };


// const getPaymentData = (req, res) => {
//   const serverPrivateKey = req.session?.serverPrivateKey;
//   const clientPublicKey = req.session?.clientPublicKey;

//   if (!serverPrivateKey || !clientPublicKey) {
//     return sendEncryptedError(res, clientPublicKey, "Missing encryption keys in session", 401);
//   }

//   const { encryptedAESKey, iv, ciphertext, authTag } = req.body;

//   if (!encryptedAESKey || !iv || !ciphertext || !authTag) {
//     return sendEncryptedError(res, clientPublicKey, "Missing encrypted fields", 400);
//   }

//   let decryptedRequest;
//   try {
//     decryptedRequest = JSON.parse(
//       decryptHybrid({ encryptedAESKey, iv, ciphertext, authTag }, serverPrivateKey)
//     );
//   } catch (err) {
//     console.error("Decryption error:", err);
//     return sendEncryptedError(res, clientPublicKey, "Invalid encrypted payload", 400);
//   }

//   const publicID = decryptedRequest?.pageID;
//   if (!publicID) {
//     return sendEncryptedError(res, clientPublicKey, "Missing page ID", 400);
//   }

//   const transactionID = req.session.publicTransactionMap?.[publicID];
//   const data = req.session.transactions?.[transactionID];

//   if (!transactionID || !data) {
//     return sendEncryptedError(res, clientPublicKey, "Transaction not found", 404);
//   }

//   const otpPageID = Object.keys(req.session.publicTransactionMap).find(
//     (key) => req.session.publicTransactionMap[key] === transactionID && key !== publicID
//   );

//   const payload = {
//     companyName: data.companyName,
//     programmName: data.programmName,
//     merchantMSISDN: data.merchantMSISDN,
//     amount: data.amount,
//     code: data.code,
//     transactionID: data.transactionID,
//     otp: data.otp,
//     otpPageID
//   };

//   const encryptedResponse = encryptHybrid(JSON.stringify(payload), clientPublicKey);
//   return res.status(200).json(encryptedResponse);
// };


const getPaymentData = async (req, res) => {
  const { encryptedAESKey, iv, ciphertext, authTag } = req.body;

  if (!encryptedAESKey || !iv || !ciphertext || !authTag) {
    return res.status(400).json({ message: "Missing encrypted fields" });
  }

  let decryptedRequest;
  let publicID;

  try {
    // أولاً: لازم نحدد الـ publicID من داخل الـ ciphertext
    // بس ما فينا نفك التشفير قبل ما نجيب المفتاح، فشو الحل؟
    // بنفترض إن العميل يرسل `pageID` صريحاً بجانب الحقول المشفّرة:
    publicID = req.body.pageID;
    if (!publicID) {
      return res.status(400).json({ message: "Missing page ID" });
    }

    // نبحث عن المعاملة حسب publicID
    const transaction = await paymentData.findOne({
      $or: [
        { "publicIDs.phonePage": publicID },
        { "publicIDs.otpPage": publicID }
      ]
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    const serverPrivateKey = transaction.serverPrivateKey;
    const clientPublicKey = transaction.clientPublicKey;

    if (!serverPrivateKey || !clientPublicKey) {
      return sendEncryptedError(res, clientPublicKey, "Missing encryption keys", 401);
    }

    decryptedRequest = JSON.parse(
      decryptHybrid({ encryptedAESKey, iv, ciphertext, authTag }, serverPrivateKey)
    );

    // تحقق إن الـ publicID في البيانات المشفّرة يطابق الموجود مسبقًا
    if (decryptedRequest?.pageID !== publicID) {
      return sendEncryptedError(res, clientPublicKey, "Mismatched page ID", 400);
    }

    const otpPageID =
      transaction.publicIDs.otpPage === publicID
        ? transaction.publicIDs.phonePage
        : transaction.publicIDs.otpPage;

    const payload = {
      companyName: transaction.companyName,
      programmName: transaction.programmName,
      merchantMSISDN: transaction.merchantMSISDN,
      amount: transaction.amount,
      code: transaction.code,
      transactionID: transaction.transactionID,
      otp: transaction.otp,
      otpPageID
    };

    const encryptedResponse = encryptHybrid(JSON.stringify(payload), clientPublicKey);
    return res.status(200).json(encryptedResponse);

  } catch (err) {
    console.error("Decryption error:", err);
    return res.status(400).json({ message: "Invalid encrypted payload" });
  }
};

// const exchangeKeys = (req, res) => {
//   const { clientPublicKey } = req.body;

//   if (!clientPublicKey) {
//     return res.status(400).json({ message: 'Missing client public key' });
//   }

//   try {
//     const { publicKey, privateKey } = generateRSAKeyPair();
//     // 🔐 تخزين المفاتيح في الجلسة
//     req.session.clientPublicKey = clientPublicKey;
//     req.session.serverPrivateKey = privateKey;

//     // 🚀 إرسال المفتاح العام للسيرفر إلى العميل
//     return res.status(200).json({ serverPublicKey: publicKey });
//   } catch (error) {
//     console.error('Key generation error:', error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

// const exchangeKeys = async (req, res) => {
//   const { clientPublicKey, phonePageID } = req.body;

//   if (!clientPublicKey || !phonePageID) {
//     return res.status(400).json({ message: 'Missing client public key or phonePageID' });
//   }

//   try {
//     const { publicKey, privateKey } = generateRSAKeyPair();

//     // تحديث السجل المقابل في قاعدة البيانات باستخدام phonePageID
//     const updated = await paymentData.findOneAndUpdate(
//       { "publicIDs.phonePage": phonePageID },
//       {
//         clientPublicKey,
//         serverPrivateKey: privateKey
//       },
//       { new: true }
//     );

//     if (!updated) {
//       return res.status(404).json({ message: "Transaction not found for given phonePageID" });
//     }

//     // إرسال المفتاح العام للسيرفر إلى العميل
//     return res.status(200).json({ serverPublicKey: publicKey });

//   } catch (error) {
//     console.error('Key generation error:', error);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// };

const exchangeKeys = async (req, res) => {
  const { clientPublicKey, phonePageID } = req.body;

  if (!clientPublicKey || !phonePageID) {
    return res.status(400).json({ message: 'Missing client public key or phonePageID' });
  }

  try {
    const { publicKey, privateKey } = generateRSAKeyPair();

    // 🔍 تحديث حسب phonePage أو otpPage
    const updated = await paymentData.findOneAndUpdate(
      {
        $or: [
          { "publicIDs.phonePage": phonePageID },
          { "publicIDs.otpPage": phonePageID }
        ]
      },
      {
        clientPublicKey,
        serverPrivateKey: privateKey
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Transaction not found for given phonePageID" });
    }

    // ✅ إرسال المفتاح العام للسيرفر
    return res.status(200).json({ serverPublicKey: publicKey });

  } catch (error) {
    console.error('Key generation error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getTransactions = async (req, res) => {
  try {
    const allowedKeys = [
      "merchantMSISDN",
      "customerMSISDN",
      "amount",
      "transactionID",
      "companyName",
      "programmName",
      "paymentSuccess"
    ];

    const { sortOrder, ...queryFilters } = req.query;

    // Validate only allowed query keys
    const invalidKeys = Object.keys(queryFilters).filter(
      key => !allowedKeys.includes(key)
    );

    if (invalidKeys.length > 0) {
      return res.status(400).json({
        message: `Invalid query key(s): ${invalidKeys.join(", ")}`
      });
    }

    const filter = {};

    for (let key in queryFilters) {
      let value = queryFilters[key];

      if (value === "true") {
        value = true;
      } else if (value === "false") {
        value = false;
      } else if (!isNaN(Number(value)) && key === "amount") {
        value = Number(value);
      } else {
        value = { $regex: value, $options: "i" };
      }

      filter[key] = value;
    }

    let sortOption = -1;
    if (sortOrder === "asc") sortOption = 1;
    else if (sortOrder === "desc") sortOption = -1;

    const transactions = await paymentData
      .find(filter)
      .sort({ createdAt: sortOption })
      .select("transactionID companyName programmName merchantMSISDN customerMSISDN amount paymentSuccess createdAt");

    // No results found
    if (transactions.length === 0) {
      return res.status(404).json({
        message: "No matching transactions found"
      });
    }

    res.status(200).json({ data: transactions });

  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = {
  saveServer,
  getToken,
  paymentRequest,
  paymentConfirmation,
  resendOTP,
  getRedirctUrl,
  getUrl,
  customerPhonePage,
  otpVerificationPage,
  getPaymentData,
  exchangeKeys,
  getTransactions
};
