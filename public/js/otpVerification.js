

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
// console.log("📦 Decrypted response:", decrypted);
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
// //   otp: DOMPurify.sanitize(rawData.otp),
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
//   // console.log(`OTP is: ${fixedData.otp}`);
// //   showToast(`Your verification code is: ${fixedData.otp}`, "success", 10000);

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
//         // const newOtp = DOMPurify.sanitize(decryptedResendOtp.otp);
//         showToast("New verification code sent successfully ✅", "success");
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

function _0x58f1(_0x4bb503,_0x5d7b2b){const _0x175604=_0x1756();return _0x58f1=function(_0x58f17f,_0x533f5f){_0x58f17f=_0x58f17f-0xbd;let _0x7fec92=_0x175604[_0x58f17f];return _0x7fec92;},_0x58f1(_0x4bb503,_0x5d7b2b);}const _0x2bd7b4=_0x58f1;(function(_0x3f79e3,_0xd29bba){const _0x411c6c=_0x58f1,_0x1e056d=_0x3f79e3();while(!![]){try{const _0x3d365e=parseInt(_0x411c6c(0x10b))/0x1*(-parseInt(_0x411c6c(0xef))/0x2)+-parseInt(_0x411c6c(0x103))/0x3+parseInt(_0x411c6c(0xea))/0x4+-parseInt(_0x411c6c(0xdb))/0x5*(-parseInt(_0x411c6c(0xeb))/0x6)+-parseInt(_0x411c6c(0xc9))/0x7+parseInt(_0x411c6c(0xd4))/0x8*(parseInt(_0x411c6c(0xc6))/0x9)+parseInt(_0x411c6c(0x10d))/0xa*(-parseInt(_0x411c6c(0xbf))/0xb);if(_0x3d365e===_0xd29bba)break;else _0x1e056d['push'](_0x1e056d['shift']());}catch(_0x4e674a){_0x1e056d['push'](_0x1e056d['shift']());}}}(_0x1756,0xf3ad0));function _0x1756(){const _0x510aed=['1408060BRJsPL','privateKey','post','otpForm','forEach','querySelectorAll','token','input','click','errorDesc','Backspace','contains','resendBtn','textContent','merchantMSISDN','5857296KqqmCN','6QqPCkR','URL\x20not\x20found\x20for\x20this\x20transaction.','display','code','173450VaPBsn','Something\x20went\x20wrong,\x20try\x20again\x20later.','serverPublicKey','publicKey','url','companyName','inline-block','addEventListener','errorCode','something\x20went\x20wrong,\x20try\x20again\x20later.','stringify','log','sanitize','OTP\x20verified\x20successfully!\x20✅','programmName','includes','Unexpected\x20error\x20occurred','response','/api/clients/getRedirct-url','value','181206WdKuYB','disabled','getElementById','length','classList','split','/api/clients/payment-data','location','5dyfCKN','error','30kwMHfM','keydown','message','status','311047XUorxy','from','/api/clients/exchange-keys','buttonContent','href','Resend\x20OTP','Next','23661BxWLXm','add','buttonSpinner','10734031TtNcIF','http://localhost:3001','DOMContentLoaded','/api/clients/resend-otp','none','Resend\x20OTP\x20in\x20','submit','data','remove','focus','transactionID','4152TitFKO','encryptedAESKey','Unknown\x20encrypted\x20error','amount','New\x20verification\x20code\x20sent\x20successfully\x20✅','success','preventDefault'];_0x1756=function(){return _0x510aed;};return _0x1756();}function setLoadingState(_0x284933){const _0x452cf1=_0x58f1,_0x83ac9b=document['getElementById']('submitButton'),_0x2e2ee6=document[_0x452cf1(0x105)](_0x452cf1(0xc8)),_0x26731e=document[_0x452cf1(0x105)](_0x452cf1(0xc2));_0x83ac9b['disabled']=_0x284933,_0x2e2ee6['style'][_0x452cf1(0xed)]=_0x284933?_0x452cf1(0xf5):_0x452cf1(0xcd),_0x26731e['textContent']=_0x284933?'':_0x452cf1(0xc5);}const pathParts=window[_0x2bd7b4(0x10a)]['pathname'][_0x2bd7b4(0x108)]('/'),publicID=pathParts[pathParts[_0x2bd7b4(0x106)]-0x1];window[_0x2bd7b4(0xf6)](_0x2bd7b4(0xcb),async()=>{const _0x35b6c4=_0x2bd7b4,_0x49d425=_0x35b6c4(0xca);let _0x26fe78;try{rsaKeyPair=await generateRSAKeyPair();const _0xdc8c0=await exportPublicKey(rsaKeyPair[_0x35b6c4(0xf2)]),_0x18a114=await axios['post'](_0x49d425+_0x35b6c4(0xc1),{'clientPublicKey':_0xdc8c0,'phonePageID':publicID},{'withCredentials':!![]});serverPublicKey=await importServerPublicKey(_0x18a114[_0x35b6c4(0xd0)][_0x35b6c4(0xf1)]);}catch(_0x48bb5d){console['log'](_0x48bb5d);}const _0x1ac7ef={'pageID':publicID},_0x3c3743=await encryptHybrid(JSON[_0x35b6c4(0xf9)](_0x1ac7ef),serverPublicKey);try{const _0x30436e={..._0x3c3743,'pageID':publicID},_0x193e69=await axios[_0x35b6c4(0xdd)](_0x49d425+_0x35b6c4(0x109),_0x30436e,{'withCredentials':!![]});console[_0x35b6c4(0xfa)](_0x193e69);const _0x27c1be=await decryptHybrid(_0x193e69[_0x35b6c4(0xd0)],rsaKeyPair['privateKey']);console[_0x35b6c4(0xfa)]('📦\x20Decrypted\x20response:',_0x27c1be);const _0x352813=_0x27c1be;console['log'](_0x352813),_0x26fe78={'companyName':DOMPurify[_0x35b6c4(0xfb)](_0x352813[_0x35b6c4(0xf4)]),'programmName':DOMPurify[_0x35b6c4(0xfb)](_0x352813[_0x35b6c4(0xfd)]),'merchantMSISDN':DOMPurify[_0x35b6c4(0xfb)](_0x352813[_0x35b6c4(0xe9)]),'code':DOMPurify[_0x35b6c4(0xfb)](_0x352813[_0x35b6c4(0xee)]),'amount':DOMPurify['sanitize'](_0x352813[_0x35b6c4(0xd7)]),'transactionID':DOMPurify[_0x35b6c4(0xfb)](_0x352813[_0x35b6c4(0xd3)])};}catch(_0x241051){if(_0x241051[_0x35b6c4(0x100)]?.[_0x35b6c4(0xd0)]?.[_0x35b6c4(0xd5)]){const _0x3364b1=await decryptHybrid(_0x241051[_0x35b6c4(0x100)][_0x35b6c4(0xd0)],rsaKeyPair[_0x35b6c4(0xdc)]),_0x2be81b=_0x3364b1[_0x35b6c4(0xbd)]||_0x3364b1[_0x35b6c4(0xe4)]||'Unknown\x20encrypted\x20error';console[_0x35b6c4(0xfa)](DOMPurify[_0x35b6c4(0xfb)](_0x2be81b),'error'),console[_0x35b6c4(0xfa)](_0x3364b1);}else console[_0x35b6c4(0xfa)](DOMPurify['sanitize'](_0x241051));}const _0x5ad48f=sessionStorage['getItem'](_0x35b6c4(0xe1)),_0x4c2f37=document[_0x35b6c4(0xe0)]('.otp-inputs\x20input'),_0x480c0b=document[_0x35b6c4(0x105)](_0x35b6c4(0xe7)),_0x422599=document[_0x35b6c4(0x105)](_0x35b6c4(0xde));_0x4c2f37[_0x35b6c4(0xdf)]((_0x2284ab,_0x1fde57)=>{const _0x2b0d50=_0x35b6c4;_0x2284ab[_0x2b0d50(0xf6)](_0x2b0d50(0xe2),()=>{const _0x50c725=_0x2b0d50;_0x2284ab[_0x50c725(0x102)][_0x50c725(0x106)]===0x1&&_0x1fde57<_0x4c2f37[_0x50c725(0x106)]-0x1&&_0x4c2f37[_0x1fde57+0x1][_0x50c725(0xd2)]();}),_0x2284ab['addEventListener'](_0x2b0d50(0x10e),_0x527024=>{const _0x3ea582=_0x2b0d50;_0x527024['key']===_0x3ea582(0xe5)&&!_0x2284ab[_0x3ea582(0x102)]&&_0x1fde57>0x0&&_0x4c2f37[_0x1fde57-0x1][_0x3ea582(0xd2)]();});}),_0x422599[_0x35b6c4(0xf6)](_0x35b6c4(0xcf),async _0x5be124=>{const _0x245cd3=_0x35b6c4;setLoadingState(!![]),_0x5be124[_0x245cd3(0xda)]();const _0x89e174=DOMPurify[_0x245cd3(0xfb)](Array[_0x245cd3(0xc0)](_0x4c2f37)['map'](_0x39e52d=>_0x39e52d[_0x245cd3(0x102)])['join'](''));if(_0x89e174[_0x245cd3(0x106)]!==0x6||!/^\d{6}$/['test'](_0x89e174)){showToast('Please\x20enter\x20a\x20valid\x206-digit\x20OTP.');return;}const _0x2adb07={'code':_0x26fe78[_0x245cd3(0xee)],'merchantMSISDN':_0x26fe78[_0x245cd3(0xe9)],'transactionID':_0x26fe78[_0x245cd3(0xd3)],'OTP':_0x89e174,'token':_0x5ad48f},_0x5944b2=await encryptHybrid(JSON[_0x245cd3(0xf9)]({..._0x2adb07,'pageID':publicID}),serverPublicKey);try{const _0x1bee9e=await axios['post'](_0x49d425+'/api/clients/payment-confirmation',{..._0x5944b2,'pageID':publicID},{'withCredentials':!![]}),_0x4e2b8e=await decryptHybrid(_0x1bee9e[_0x245cd3(0xd0)],rsaKeyPair[_0x245cd3(0xdc)]);if(_0x4e2b8e['errorCode']===0x0){setLoadingState(![]),showToast(_0x245cd3(0xfc),_0x245cd3(0xd9));const _0x5f522c={'companyName':_0x26fe78[_0x245cd3(0xf4)],'programmName':_0x26fe78[_0x245cd3(0xfd)],'code':_0x26fe78['code']},_0x16b07d=await encryptHybrid(JSON[_0x245cd3(0xf9)]({..._0x5f522c,'pageID':publicID}),serverPublicKey);try{const _0x468506=await axios[_0x245cd3(0xdd)](_0x49d425+_0x245cd3(0x101),{..._0x16b07d,'pageID':publicID},{'withCredentials':!![]}),_0x44efb5=await decryptHybrid(_0x468506[_0x245cd3(0xd0)],rsaKeyPair['privateKey']);_0x44efb5[_0x245cd3(0xf3)]?window[_0x245cd3(0x10a)][_0x245cd3(0xc3)]=_0x44efb5[_0x245cd3(0xf3)]:showToast(_0x245cd3(0xec));}catch(_0x566fbc){if(_0x566fbc['response']?.[_0x245cd3(0xd0)]?.[_0x245cd3(0xd5)]){const _0xa0467b=await decryptHybrid(_0x566fbc['response']['data'],rsaKeyPair[_0x245cd3(0xdc)]),_0x510173=_0xa0467b[_0x245cd3(0xbd)]||_0xa0467b[_0x245cd3(0xe4)]||'Unknown\x20encrypted\x20error';console['log'](DOMPurify[_0x245cd3(0xfb)](_0x510173),_0x245cd3(0x10c));}else console[_0x245cd3(0xfa)](_0x245cd3(0xff),_0x245cd3(0x10c));}}}catch(_0x598309){setLoadingState(![]);if(_0x598309[_0x245cd3(0x100)]?.[_0x245cd3(0xd0)]?.['encryptedAESKey']){const _0xce5613=await decryptHybrid(_0x598309[_0x245cd3(0x100)][_0x245cd3(0xd0)],rsaKeyPair[_0x245cd3(0xdc)]),_0x4df2c8=_0xce5613[_0x245cd3(0xbd)]||_0xce5613[_0x245cd3(0xe4)]||_0x245cd3(0xd6);console[_0x245cd3(0xfa)](DOMPurify['sanitize'](_0x4df2c8),_0x245cd3(0x10c));if(_0x598309[_0x245cd3(0x100)][_0x245cd3(0xbe)]===0x194||0x195||0x196||0x197||0x198||0x19a){const _0x51c82f=DOMPurify[_0x245cd3(0xfb)](_0x4df2c8);showToast(_0x51c82f);return;}else showToast(_0x245cd3(0xf8));}else console[_0x245cd3(0xfa)](DOMPurify[_0x245cd3(0xfb)](_0x598309)),showToast(_0x245cd3(0xf8));}}),_0x480c0b[_0x35b6c4(0xf6)](_0x35b6c4(0xe3),async()=>{const _0x34b1c3=_0x35b6c4;if(_0x480c0b[_0x34b1c3(0x107)][_0x34b1c3(0xe6)]('disabled'))return;_0x480c0b[_0x34b1c3(0x107)][_0x34b1c3(0xc7)]('disabled');let _0x493335=0x3c;_0x480c0b[_0x34b1c3(0xe8)]='Resend\x20OTP\x20in\x20'+_0x493335+'s';const _0x58e226=setInterval(()=>{const _0x4492d8=_0x34b1c3;_0x493335--,_0x480c0b[_0x4492d8(0xe8)]=_0x4492d8(0xce)+_0x493335+'s',_0x493335<=0x0&&(clearInterval(_0x58e226),_0x480c0b[_0x4492d8(0x107)][_0x4492d8(0xd1)](_0x4492d8(0x104)),_0x480c0b[_0x4492d8(0xe8)]=_0x4492d8(0xc4));},0x3e8),_0x2c75f8={'code':_0x26fe78[_0x34b1c3(0xee)],'merchantMSISDN':_0x26fe78[_0x34b1c3(0xe9)],'transactionID':_0x26fe78[_0x34b1c3(0xd3)],'token':_0x5ad48f},_0x53009f=await encryptHybrid(JSON[_0x34b1c3(0xf9)]({..._0x2c75f8,'pageID':publicID}),serverPublicKey);try{const _0x3ac616=await axios['post'](_0x49d425+_0x34b1c3(0xcc),{..._0x53009f,'pageID':publicID},{'withCredentials':!![]}),_0x3be0c8=await decryptHybrid(_0x3ac616['data'],rsaKeyPair['privateKey']);_0x3be0c8[_0x34b1c3(0xf7)]===0x0&&showToast(_0x34b1c3(0xd8),_0x34b1c3(0xd9));}catch(_0x451c84){if(_0x451c84[_0x34b1c3(0x100)]?.[_0x34b1c3(0xd0)]?.['encryptedAESKey']){const _0x1707b9=await decryptHybrid(_0x451c84['response'][_0x34b1c3(0xd0)],rsaKeyPair[_0x34b1c3(0xdc)]),_0x4fdad9=_0x1707b9[_0x34b1c3(0xbd)]||_0x1707b9[_0x34b1c3(0xe4)]||_0x34b1c3(0xd6);console[_0x34b1c3(0xfa)](DOMPurify[_0x34b1c3(0xfb)](_0x4fdad9),_0x34b1c3(0x10c));if(_0x451c84['response']&&[0x195,0x19a][_0x34b1c3(0xfe)](_0x451c84[_0x34b1c3(0x100)][_0x34b1c3(0xbe)])){clearInterval(_0x58e226),_0x480c0b[_0x34b1c3(0x107)]['remove'](_0x34b1c3(0x104)),_0x480c0b[_0x34b1c3(0xe8)]='Resend\x20OTP';const _0x1489cf=DOMPurify[_0x34b1c3(0xfb)](_0x4fdad9);showToast(_0x1489cf);return;}else clearInterval(_0x58e226),_0x480c0b['classList'][_0x34b1c3(0xd1)](_0x34b1c3(0x104)),_0x480c0b[_0x34b1c3(0xe8)]='Resend\x20OTP',showToast(_0x34b1c3(0xf0));}else console['log'](DOMPurify[_0x34b1c3(0xfb)](_0x451c84)),showToast(_0x34b1c3(0xf8));}});});