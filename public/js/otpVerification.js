

// function setLoadingState(isLoading) {
//   const button = document.getElementById("submitButton");
//   const spinner = document.getElementById("buttonSpinner");
//   const text = document.getElementById("buttonContent");

//   button.disabled = isLoading;
//   spinner.style.display = isLoading ? "inline-block" : "none";
//   text.textContent = isLoading ? "" : "Next";
// }

// const pathParts = window.location.pathname.split("/");
// const publicID = pathParts[pathParts.length - 1];
// window.addEventListener("DOMContentLoaded", async () => {
//   // const baseURL = "https://projecttwo-iqjp.onrender.com";
//     const baseURL = "http://localhost:3001";
//   let fixedData;
//     try{
//     rsaKeyPair = await generateRSAKeyPair();
//     const exportedPublicKey = await exportPublicKey(rsaKeyPair.publicKey);
    
//     const resKey = await axios.post(`${baseURL}/api/clients/exchange-keys`, {
//       clientPublicKey: exportedPublicKey, // ✅ تعديل الاسم
//       phonePageID: publicID // ✅ أضف هذا
//     }, {
//       withCredentials: true
//     });

//     serverPublicKey = await importServerPublicKey(resKey.data.serverPublicKey);

//     }catch(error){
//       console.log(error);
//     }

// const payload = { pageID: publicID };
// const encryptedPayload = await encryptHybrid(JSON.stringify(payload), serverPublicKey);


// try{
// const encryptedPayloadWithPageID = {
//   ...encryptedPayload,
//   pageID: publicID // ✅ أضفها داخل body
// };

// const res = await axios.post(`${baseURL}/api/clients/payment-data`, encryptedPayloadWithPageID, {
//   withCredentials: true
// });



// console.log(res);

// // 3. فك تشفير الاستجابة
// const decrypted = await decryptHybrid(res.data, rsaKeyPair.privateKey);
// const rawData = decrypted;

// console.log(rawData);


// // 4. تعقيم البيانات
// fixedData = {
//   companyName: DOMPurify.sanitize(rawData.companyName),
//   programmName: DOMPurify.sanitize(rawData.programmName),
//   merchantMSISDN: DOMPurify.sanitize(rawData.merchantMSISDN),
//   code: DOMPurify.sanitize(rawData.code),
//   amount: DOMPurify.sanitize(rawData.amount),
//   transactionID: DOMPurify.sanitize(rawData.transactionID),
//   otp: DOMPurify.sanitize(rawData.otp),
// };
// // otpPageID = DOMPurify.sanitize(rawData.otpPageID);

// } catch (error) {
//     if (error.response?.data?.encryptedAESKey) {
//       // إذا الخطأ مشفّر
//       const decryptedError = await decryptHybrid(error.response.data, rsaKeyPair.privateKey);
//       const errMsg = decryptedError.message || decryptedError.errorDesc || "Unknown encrypted error";
//       console.log(DOMPurify.sanitize(errMsg), "error");
//       console.log(decryptedError);
//     }
//      else {
//       console.log(DOMPurify.sanitize(error));
//     }
// }

//   // ✅ عرض OTP في toast للتجريب
//   console.log(`OTP is: ${fixedData.otp}`);
//   showToast(`Your verification code is: ${fixedData.otp}`, "success", 10000);

//   // ✅ قراءة التوكن من الكوكيز
//   // function getCookie(name) {
//   //   const cookies = document.cookie.split("; ");
//   //   const found = cookies.find(row => row.startsWith(name + "="));
//   //   return found ? found.split("=")[1] : null;
//   // }

//   const token = sessionStorage.getItem("token");

//   const inputs = document.querySelectorAll(".otp-inputs input");
//   const resendBtn = document.getElementById("resendBtn");
//   const form = document.getElementById("otpForm");

//   // ✅ التنقل بين خانات الإدخال
//   inputs.forEach((input, index) => {
//     input.addEventListener("input", () => {
//       if (input.value.length === 1 && index < inputs.length - 1) {
//         inputs[index + 1].focus();
//       }
//     });

//     input.addEventListener("keydown", (e) => {
//       if (e.key === "Backspace" && !input.value && index > 0) {
//         inputs[index - 1].focus();
//       }
//     });
//   });

//   // ✅ التحقق من رمز OTP عند الإرسال
//   form.addEventListener("submit", async (e) => {
//     setLoadingState(true); 
//     e.preventDefault();

//     const otpCode = DOMPurify.sanitize(Array.from(inputs).map(input => input.value).join(""));

//     if (otpCode.length !== 6 || !/^\d{6}$/.test(otpCode)) {
//       showToast("Please enter a valid 6-digit OTP.");
//       return;
//     }

//         const paymentConfirmationPayload ={
//           code: fixedData.code,
//           merchantMSISDN: fixedData.merchantMSISDN,
//           transactionID: fixedData.transactionID,
//           OTP: otpCode,
//           token
//     };

//   const encryptedPaymentConfirmationPayload = await encryptHybrid(JSON.stringify({
//     ...paymentConfirmationPayload,
//     pageID: publicID // ✅ أضف pageID داخل البيانات المشفرة
//   }), serverPublicKey);


//     try {
//   const confirmRes = await axios.post(`${baseURL}/api/clients/payment-confirmation`, {
//     ...encryptedPaymentConfirmationPayload,
//     pageID: publicID // ✅ أضف pageID أيضًا خارج التشفير
//   }, {
//     withCredentials: true
//   });
// const decryptedConfirmRes = await decryptHybrid(confirmRes.data, rsaKeyPair.privateKey);


// if (decryptedConfirmRes.errorCode === 0) {
//   setLoadingState(false); 
//   showToast("OTP verified successfully! ✅", "success");

//   // ثم نرسل getRedirct-url كالمعتاد

//          const redirectUrlPayload ={
//         companyName: fixedData.companyName,
//         programmName: fixedData.programmName,
//         code: fixedData.code
//     };

//   const encryptedRedirectUrlPayload = await encryptHybrid(JSON.stringify({
//     ...redirectUrlPayload,
//     pageID: publicID // ✅ أضف pageID داخل البيانات المشفرة
//   }), serverPublicKey);


//     try{

//   const urlResponse = await axios.post(`${baseURL}/api/clients/getRedirct-url`, {
//     ...encryptedRedirectUrlPayload,
//     pageID: publicID // ✅ أضف pageID أيضًا خارج التشفير
//   }, {
//     withCredentials: true
//   });

//     const decryptedUrlResponse = await decryptHybrid(urlResponse.data, rsaKeyPair.privateKey);

//    if (decryptedUrlResponse.url) {
//     window.location.href = decryptedUrlResponse.url;
//   } else {
//     showToast("URL not found for this transaction.");
//   }
//   }catch (error) {
//     if (error.response?.data?.encryptedAESKey) {
//       // إذا الخطأ مشفّر
//       const decryptedError = await decryptHybrid(error.response.data, rsaKeyPair.privateKey);
//       const errMsg = decryptedError.message || decryptedError.errorDesc || "Unknown encrypted error";
//       console.log(DOMPurify.sanitize(errMsg), "error");
//     }
//     else {
//       console.log("Unexpected error occurred", "error");
//     }
// }

// } 

// } catch (error) {
//     setLoadingState(false); 
//     if (error.response?.data?.encryptedAESKey) {
//       // إذا الخطأ مشفّر
//       const decryptedError = await decryptHybrid(error.response.data, rsaKeyPair.privateKey);
//       const errMsg = decryptedError.message || decryptedError.errorDesc || "Unknown encrypted error";
//       console.log(DOMPurify.sanitize(errMsg), "error");

//     if(error.response.status === 404 || 405 || 406 || 407 || 408 || 410 ){
//             const errorMessage = DOMPurify.sanitize(errMsg);
//             showToast(errorMessage);
//             return;
//         }

//     else {
//       showToast("something went wrong, try again later.");
//     }


//     } else {
//       console.log(DOMPurify.sanitize(error));
//       showToast("something went wrong, try again later.");
//     }
// }
//   });

//   // ✅ إعادة إرسال OTP
//   resendBtn.addEventListener("click", async () => {
//     if (resendBtn.classList.contains("disabled")) return;

//     resendBtn.classList.add("disabled");
//     let seconds = 60;
//     resendBtn.textContent = `Resend OTP in ${seconds}s`;

//     const timerInterval = setInterval(() => {
//       seconds--;
//       resendBtn.textContent = `Resend OTP in ${seconds}s`;
//       if (seconds <= 0) {
//         clearInterval(timerInterval);
//         resendBtn.classList.remove("disabled");
//         resendBtn.textContent = "Resend OTP";
//       }
//     }, 1000);

//             const resendOtpPayload ={
//         code: fixedData.code,
//         merchantMSISDN: fixedData.merchantMSISDN,
//         transactionID: fixedData.transactionID,
//         token
//     };

//   const encryptedresendOtpPayload = await encryptHybrid(JSON.stringify({
//     ...resendOtpPayload,
//     pageID: publicID // ✅ أضف pageID داخل البيانات المشفرة
//   }), serverPublicKey);



//     try {
//     const response = await axios.post(`${baseURL}/api/clients/resend-otp`, {
//       ...encryptedresendOtpPayload,
//       pageID: publicID // ✅ أضف pageID أيضًا خارج التشفير
//     }, {
//       withCredentials: true
//     });

//     const decryptedResendOtp = await decryptHybrid(response.data, rsaKeyPair.privateKey);

//       if (decryptedResendOtp.errorCode === 0) {
//         const newOtp = DOMPurify.sanitize(decryptedResendOtp.otp);
//         showToast(`Your new verification code is: ${newOtp}`, "success", 10000);
//       } 
//     }catch (error) {
//     if (error.response?.data?.encryptedAESKey) {
//       // إذا الخطأ مشفّر
//       const decryptedError = await decryptHybrid(error.response.data, rsaKeyPair.privateKey);
//       const errMsg = decryptedError.message || decryptedError.errorDesc || "Unknown encrypted error";
//       console.log(DOMPurify.sanitize(errMsg), "error");

//       if (error.response && [405 , 410].includes(error.response.status)) {
//         clearInterval(timerInterval);
//         resendBtn.classList.remove("disabled");
//         resendBtn.textContent = "Resend OTP";
//         const errorMessage = DOMPurify.sanitize(errMsg);
//         showToast(errorMessage);
//         return;

//       } else {
//       clearInterval(timerInterval);
//       resendBtn.classList.remove("disabled");
//       resendBtn.textContent = "Resend OTP";
//       showToast("Something went wrong, try again later.");
//       }
//     } else {
//       console.log(DOMPurify.sanitize(error));
//       showToast("something went wrong, try again later.");
//     }
// }
//   });
// });

const _0x123a58=_0x1d4f;(function(_0x5ff990,_0x462722){const _0x5dadf7=_0x1d4f,_0xf71ee0=_0x5ff990();while(!![]){try{const _0x4f44b7=parseInt(_0x5dadf7(0x18d))/0x1+-parseInt(_0x5dadf7(0x199))/0x2*(-parseInt(_0x5dadf7(0x1a8))/0x3)+parseInt(_0x5dadf7(0x1b2))/0x4*(-parseInt(_0x5dadf7(0x1b4))/0x5)+-parseInt(_0x5dadf7(0x1c3))/0x6+parseInt(_0x5dadf7(0x1d2))/0x7+parseInt(_0x5dadf7(0x1a9))/0x8+parseInt(_0x5dadf7(0x1c9))/0x9*(-parseInt(_0x5dadf7(0x1b9))/0xa);if(_0x4f44b7===_0x462722)break;else _0xf71ee0['push'](_0xf71ee0['shift']());}catch(_0x5f1f85){_0xf71ee0['push'](_0xf71ee0['shift']());}}}(_0x52ec,0xf277d));function setLoadingState(_0x323add){const _0x43d560=_0x1d4f,_0x338069=document['getElementById'](_0x43d560(0x1c4)),_0x4aeb9f=document['getElementById'](_0x43d560(0x1de)),_0x53ab78=document['getElementById'](_0x43d560(0x1a5));_0x338069['disabled']=_0x323add,_0x4aeb9f[_0x43d560(0x1bd)][_0x43d560(0x1ab)]=_0x323add?_0x43d560(0x1a3):_0x43d560(0x1ca),_0x53ab78['textContent']=_0x323add?'':_0x43d560(0x19a);}function _0x1d4f(_0x106cdf,_0x5426cd){const _0x52ecb1=_0x52ec();return _0x1d4f=function(_0x1d4f53,_0x2e9df0){_0x1d4f53=_0x1d4f53-0x18d;let _0xd6ee23=_0x52ecb1[_0x1d4f53];return _0xd6ee23;},_0x1d4f(_0x106cdf,_0x5426cd);}const pathParts=window[_0x123a58(0x1b5)]['pathname'][_0x123a58(0x1d8)]('/'),publicID=pathParts[pathParts['length']-0x1];window[_0x123a58(0x1c0)](_0x123a58(0x1ba),async()=>{const _0x243071=_0x123a58,_0x1ef114=_0x243071(0x1bb);let _0x4d2ddf;try{rsaKeyPair=await generateRSAKeyPair();const _0x2d854e=await exportPublicKey(rsaKeyPair[_0x243071(0x191)]),_0x10b90f=await axios[_0x243071(0x1c7)](_0x1ef114+_0x243071(0x1db),{'clientPublicKey':_0x2d854e,'phonePageID':publicID},{'withCredentials':!![]});serverPublicKey=await importServerPublicKey(_0x10b90f[_0x243071(0x190)][_0x243071(0x1a6)]);}catch(_0x49828d){console[_0x243071(0x19f)](_0x49828d);}const _0x1df2f5={'pageID':publicID},_0x5823d4=await encryptHybrid(JSON['stringify'](_0x1df2f5),serverPublicKey);try{const _0x54c9c4={..._0x5823d4,'pageID':publicID},_0x4ba1b9=await axios['post'](_0x1ef114+_0x243071(0x1d7),_0x54c9c4,{'withCredentials':!![]});console['log'](_0x4ba1b9);const _0x5b6e12=await decryptHybrid(_0x4ba1b9[_0x243071(0x190)],rsaKeyPair[_0x243071(0x1d9)]),_0x382103=_0x5b6e12;console['log'](_0x382103),_0x4d2ddf={'companyName':DOMPurify[_0x243071(0x1dc)](_0x382103[_0x243071(0x1d6)]),'programmName':DOMPurify[_0x243071(0x1dc)](_0x382103[_0x243071(0x1a0)]),'merchantMSISDN':DOMPurify[_0x243071(0x1dc)](_0x382103[_0x243071(0x1e1)]),'code':DOMPurify['sanitize'](_0x382103[_0x243071(0x1ac)]),'amount':DOMPurify[_0x243071(0x1dc)](_0x382103[_0x243071(0x19b)]),'transactionID':DOMPurify[_0x243071(0x1dc)](_0x382103[_0x243071(0x1d3)]),'otp':DOMPurify['sanitize'](_0x382103['otp'])};}catch(_0x2fb6ff){if(_0x2fb6ff[_0x243071(0x1d0)]?.[_0x243071(0x190)]?.['encryptedAESKey']){const _0x257b71=await decryptHybrid(_0x2fb6ff[_0x243071(0x1d0)][_0x243071(0x190)],rsaKeyPair[_0x243071(0x1d9)]),_0x1a40bf=_0x257b71['message']||_0x257b71[_0x243071(0x18f)]||_0x243071(0x195);console['log'](DOMPurify[_0x243071(0x1dc)](_0x1a40bf),'error'),console[_0x243071(0x19f)](_0x257b71);}else console['log'](DOMPurify[_0x243071(0x1dc)](_0x2fb6ff));}console[_0x243071(0x19f)](_0x243071(0x1e0)+_0x4d2ddf[_0x243071(0x192)]),showToast('Your\x20verification\x20code\x20is:\x20'+_0x4d2ddf[_0x243071(0x192)],'success',0x2710);const _0x5771c7=sessionStorage[_0x243071(0x1aa)](_0x243071(0x1a1)),_0x5ef732=document[_0x243071(0x1a2)](_0x243071(0x1d4)),_0x2ae9bd=document[_0x243071(0x18e)](_0x243071(0x1df)),_0x7934dd=document[_0x243071(0x18e)]('otpForm');_0x5ef732[_0x243071(0x1b0)]((_0x5e0708,_0x472f74)=>{const _0x33dfdf=_0x243071;_0x5e0708[_0x33dfdf(0x1c0)](_0x33dfdf(0x1c5),()=>{const _0x424a6d=_0x33dfdf;_0x5e0708[_0x424a6d(0x1e3)][_0x424a6d(0x19d)]===0x1&&_0x472f74<_0x5ef732[_0x424a6d(0x19d)]-0x1&&_0x5ef732[_0x472f74+0x1]['focus']();}),_0x5e0708[_0x33dfdf(0x1c0)](_0x33dfdf(0x1c6),_0x12f672=>{const _0x12e216=_0x33dfdf;_0x12f672[_0x12e216(0x196)]===_0x12e216(0x1e4)&&!_0x5e0708[_0x12e216(0x1e3)]&&_0x472f74>0x0&&_0x5ef732[_0x472f74-0x1]['focus']();});}),_0x7934dd[_0x243071(0x1c0)](_0x243071(0x1b8),async _0x2ed6bc=>{const _0x55b546=_0x243071;setLoadingState(!![]),_0x2ed6bc[_0x55b546(0x1bf)]();const _0x5dabf4=DOMPurify[_0x55b546(0x1dc)](Array[_0x55b546(0x1b7)](_0x5ef732)['map'](_0x4238f1=>_0x4238f1[_0x55b546(0x1e3)])[_0x55b546(0x1b6)](''));if(_0x5dabf4[_0x55b546(0x19d)]!==0x6||!/^\d{6}$/[_0x55b546(0x1da)](_0x5dabf4)){showToast(_0x55b546(0x1af));return;}const _0x3d234a={'code':_0x4d2ddf['code'],'merchantMSISDN':_0x4d2ddf[_0x55b546(0x1e1)],'transactionID':_0x4d2ddf['transactionID'],'OTP':_0x5dabf4,'token':_0x5771c7},_0x2b34f5=await encryptHybrid(JSON[_0x55b546(0x1b1)]({..._0x3d234a,'pageID':publicID}),serverPublicKey);try{const _0x47c784=await axios['post'](_0x1ef114+_0x55b546(0x1cf),{..._0x2b34f5,'pageID':publicID},{'withCredentials':!![]}),_0x51b377=await decryptHybrid(_0x47c784['data'],rsaKeyPair[_0x55b546(0x1d9)]);if(_0x51b377[_0x55b546(0x1e5)]===0x0){setLoadingState(![]),showToast(_0x55b546(0x1a7),_0x55b546(0x1d5));const _0x3b2997={'companyName':_0x4d2ddf[_0x55b546(0x1d6)],'programmName':_0x4d2ddf[_0x55b546(0x1a0)],'code':_0x4d2ddf[_0x55b546(0x1ac)]},_0x40a165=await encryptHybrid(JSON[_0x55b546(0x1b1)]({..._0x3b2997,'pageID':publicID}),serverPublicKey);try{const _0x4f3121=await axios[_0x55b546(0x1c7)](_0x1ef114+_0x55b546(0x193),{..._0x40a165,'pageID':publicID},{'withCredentials':!![]}),_0x200e04=await decryptHybrid(_0x4f3121[_0x55b546(0x190)],rsaKeyPair['privateKey']);_0x200e04[_0x55b546(0x1cd)]?window['location'][_0x55b546(0x197)]=_0x200e04[_0x55b546(0x1cd)]:showToast(_0x55b546(0x1c8));}catch(_0x4a0457){if(_0x4a0457[_0x55b546(0x1d0)]?.['data']?.[_0x55b546(0x1a4)]){const _0x58eac2=await decryptHybrid(_0x4a0457[_0x55b546(0x1d0)][_0x55b546(0x190)],rsaKeyPair[_0x55b546(0x1d9)]),_0x1d8fee=_0x58eac2[_0x55b546(0x1d1)]||_0x58eac2[_0x55b546(0x18f)]||_0x55b546(0x195);console[_0x55b546(0x19f)](DOMPurify[_0x55b546(0x1dc)](_0x1d8fee),_0x55b546(0x1c1));}else console[_0x55b546(0x19f)](_0x55b546(0x1b3),_0x55b546(0x1c1));}}}catch(_0x2f8d83){setLoadingState(![]);if(_0x2f8d83['response']?.[_0x55b546(0x190)]?.['encryptedAESKey']){const _0x5c35fe=await decryptHybrid(_0x2f8d83[_0x55b546(0x1d0)][_0x55b546(0x190)],rsaKeyPair[_0x55b546(0x1d9)]),_0x4dd848=_0x5c35fe['message']||_0x5c35fe[_0x55b546(0x18f)]||_0x55b546(0x195);console[_0x55b546(0x19f)](DOMPurify['sanitize'](_0x4dd848),_0x55b546(0x1c1));if(_0x2f8d83[_0x55b546(0x1d0)]['status']===0x194||0x195||0x196||0x197||0x198||0x19a){const _0x19cb8a=DOMPurify[_0x55b546(0x1dc)](_0x4dd848);showToast(_0x19cb8a);return;}else showToast(_0x55b546(0x1cc));}else console[_0x55b546(0x19f)](DOMPurify['sanitize'](_0x2f8d83)),showToast(_0x55b546(0x1cc));}}),_0x2ae9bd[_0x243071(0x1c0)](_0x243071(0x1ae),async()=>{const _0x450c44=_0x243071;if(_0x2ae9bd['classList'][_0x450c44(0x19e)](_0x450c44(0x1dd)))return;_0x2ae9bd[_0x450c44(0x1ad)][_0x450c44(0x1e2)](_0x450c44(0x1dd));let _0x4e3643=0x3c;_0x2ae9bd[_0x450c44(0x1be)]='Resend\x20OTP\x20in\x20'+_0x4e3643+'s';const _0x4a1daf=setInterval(()=>{const _0x39e260=_0x450c44;_0x4e3643--,_0x2ae9bd[_0x39e260(0x1be)]=_0x39e260(0x1cb)+_0x4e3643+'s',_0x4e3643<=0x0&&(clearInterval(_0x4a1daf),_0x2ae9bd[_0x39e260(0x1ad)][_0x39e260(0x19c)](_0x39e260(0x1dd)),_0x2ae9bd[_0x39e260(0x1be)]='Resend\x20OTP');},0x3e8),_0x39b361={'code':_0x4d2ddf['code'],'merchantMSISDN':_0x4d2ddf[_0x450c44(0x1e1)],'transactionID':_0x4d2ddf['transactionID'],'token':_0x5771c7},_0x4c5323=await encryptHybrid(JSON['stringify']({..._0x39b361,'pageID':publicID}),serverPublicKey);try{const _0x91b8a1=await axios[_0x450c44(0x1c7)](_0x1ef114+_0x450c44(0x1bc),{..._0x4c5323,'pageID':publicID},{'withCredentials':!![]}),_0xea7a52=await decryptHybrid(_0x91b8a1['data'],rsaKeyPair[_0x450c44(0x1d9)]);if(_0xea7a52['errorCode']===0x0){const _0x36dc81=DOMPurify[_0x450c44(0x1dc)](_0xea7a52[_0x450c44(0x192)]);showToast(_0x450c44(0x1c2)+_0x36dc81,_0x450c44(0x1d5),0x2710);}}catch(_0x49d2da){if(_0x49d2da['response']?.[_0x450c44(0x190)]?.[_0x450c44(0x1a4)]){const _0x5c466b=await decryptHybrid(_0x49d2da['response'][_0x450c44(0x190)],rsaKeyPair[_0x450c44(0x1d9)]),_0x4ebe5b=_0x5c466b[_0x450c44(0x1d1)]||_0x5c466b[_0x450c44(0x18f)]||_0x450c44(0x195);console[_0x450c44(0x19f)](DOMPurify['sanitize'](_0x4ebe5b),_0x450c44(0x1c1));if(_0x49d2da[_0x450c44(0x1d0)]&&[0x195,0x19a][_0x450c44(0x1ce)](_0x49d2da[_0x450c44(0x1d0)][_0x450c44(0x198)])){clearInterval(_0x4a1daf),_0x2ae9bd['classList'][_0x450c44(0x19c)](_0x450c44(0x1dd)),_0x2ae9bd[_0x450c44(0x1be)]=_0x450c44(0x194);const _0x239bfe=DOMPurify['sanitize'](_0x4ebe5b);showToast(_0x239bfe);return;}else clearInterval(_0x4a1daf),_0x2ae9bd['classList'][_0x450c44(0x19c)](_0x450c44(0x1dd)),_0x2ae9bd[_0x450c44(0x1be)]='Resend\x20OTP',showToast('Something\x20went\x20wrong,\x20try\x20again\x20later.');}else console[_0x450c44(0x19f)](DOMPurify['sanitize'](_0x49d2da)),showToast(_0x450c44(0x1cc));}});});function _0x52ec(){const _0x3fcbcc=['inline-block','encryptedAESKey','buttonContent','serverPublicKey','OTP\x20verified\x20successfully!\x20✅','69mCXjjV','15743496TrMzlF','getItem','display','code','classList','click','Please\x20enter\x20a\x20valid\x206-digit\x20OTP.','forEach','stringify','4365580MDKsBb','Unexpected\x20error\x20occurred','5MkeofW','location','join','from','submit','3476080mZqlEW','DOMContentLoaded','http://localhost:3001','/api/clients/resend-otp','style','textContent','preventDefault','addEventListener','error','Your\x20new\x20verification\x20code\x20is:\x20','7714872WuGrOh','submitButton','input','keydown','post','URL\x20not\x20found\x20for\x20this\x20transaction.','63YUjUhq','none','Resend\x20OTP\x20in\x20','something\x20went\x20wrong,\x20try\x20again\x20later.','url','includes','/api/clients/payment-confirmation','response','message','2932496FKpZKw','transactionID','.otp-inputs\x20input','success','companyName','/api/clients/payment-data','split','privateKey','test','/api/clients/exchange-keys','sanitize','disabled','buttonSpinner','resendBtn','OTP\x20is:\x20','merchantMSISDN','add','value','Backspace','errorCode','1735217zgpvCS','getElementById','errorDesc','data','publicKey','otp','/api/clients/getRedirct-url','Resend\x20OTP','Unknown\x20encrypted\x20error','key','href','status','146220ZqlUKK','Next','amount','remove','length','contains','log','programmName','token','querySelectorAll'];_0x52ec=function(){return _0x3fcbcc;};return _0x52ec();}