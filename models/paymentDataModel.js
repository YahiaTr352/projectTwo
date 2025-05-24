const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  transactionID: { type: String, required: true, unique: true },
  companyName: String,
  programmName: String,
  code: Number,
  merchantMSISDN: String,
  customerMSISDN: String,
  amount: Number,
  otp: { type: String, default: null },
  publicIDs: {
    phonePage: String,
    otpPage: String
  },
  clientPublicKey: String,
  serverPrivateKey: String,
  paymentSuccess: { type: Boolean, default: false }, 
  createdAt: { type: Date, default: Date.now }
});

const paymentData = mongoose.model("Transaction", transactionSchema);

module.exports = paymentData;
