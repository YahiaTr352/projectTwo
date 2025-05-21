const express = require("express");
const { paymentRequest, getToken, paymentConfirmation, resendOTP, customerPhonePage, otpVerificationPage, getPaymentData, getBaseURL, getUrl, getRedirctUrl, exchangeKeys } = require("../controllers/potato");
const limiter = require("../middlewares/limiter");
const router = express.Router();

router.post("/get-token" ,getToken);
router.post("/payment-request" ,paymentRequest);
router.post("/payment-confirmation" ,paymentConfirmation);
router.post("/resend-otp" ,resendOTP);
router.post("/getRedirct-url" ,getRedirctUrl);
router.post("/get-url" ,getUrl);
router.post("/exchange-keys" ,exchangeKeys);
// router.get("/customerPhone-page/:transactionID" ,customerPhonePage);
// router.get("/otpVerification-page/:transactionID" ,otpVerificationPage);
router.get("/customerPhone-page/:publicID", customerPhonePage);
router.get("/otpVerification-page/:publicID", otpVerificationPage);
router.post("/payment-data" ,getPaymentData);
// router.get("/get-baseurl", getBaseURL);
module.exports = router;