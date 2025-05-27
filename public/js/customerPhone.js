// function setPageLoadingState(isLoading) {
//   const spinner = document.getElementById("loadingSpinner");
//   const content = document.getElementById("phonePage");

//   spinner.style.display = isLoading ? "flex" : "none";
//   content.style.display = isLoading ? "none" : "flex";
// }

// function setLoadingState(isLoading) {
//   const button = document.getElementById("submitButton");
//   const spinner = document.getElementById("buttonSpinner");
//   const text = document.getElementById("buttonContent");

//   button.disabled = isLoading;
//   spinner.style.display = isLoading ? "inline-block" : "none";
//   text.textContent = isLoading ? "" : "Next";
// }

// // const baseURL = "https://projecttwo-iqjp.onrender.com";
// const baseURL = "http://localhost:3001";

// async function sendData() {
//   setPageLoadingState(true); // أظهر الشيمر أول ما تبدأ
//           const pathParts = window.location.pathname.split("/");
//         const publicID = pathParts[pathParts.length - 1];
//   try {

//     try{
//       const saveSyrital = await axios.post(`https://projectone-wqlf.onrender.com/api/clients/save-server`);

//       console.log(saveSyrital.data.message)

//     }catch(error){
//       console.log(error);
//     }

//     try{
//       const savePackage = await axios.post(`${baseURL}/api/clients/save-server`);

//       console.log(savePackage.data.message)

//     }catch(error){
//       console.log(error);
//     }
//     // توليد مفتاح RSA للمتصفح
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

// // 2. إرسال الطلب المشفر بـ POST
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
// };
// otpPageID = DOMPurify.sanitize(rawData.otpPageID);

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

// document.getElementById("merchantInfo").innerHTML =
//   `<strong>Merchant:</strong> ${fixedData.programmName}`;

// document.getElementById("amountInfo").innerHTML =
//   `<strong>Total Amount:</strong> ${Number(fixedData.amount).toLocaleString()} SP`;


//   try{

//     // تشفير البيانات وإرسال طلب token
//   const tokenPayload = {
//       companyName: fixedData.companyName,
//       programmName: fixedData.programmName,
//       merchantMSISDN: fixedData.merchantMSISDN,
//       code: fixedData.code
//     };

//     const encryptedToken = await encryptHybrid(JSON.stringify({
//       ...tokenPayload,
//       pageID: publicID
//     }), serverPublicKey);

//     const tokenRes = await axios.post(`${baseURL}/api/clients/get-token`, {
//       ...encryptedToken,
//       pageID: publicID
//     }, { withCredentials: true });

//     const result = await decryptHybrid(tokenRes.data, rsaKeyPair.privateKey);
//     // document.cookie = `token=${result.token}; path=/; SameSite=Lax`;
//     sessionStorage.setItem("token", result.token);


//   } catch (error) {
//     if (error.response?.data?.encryptedAESKey) {
//       // إذا الخطأ مشفّر
//       const decryptedError = await decryptHybrid(error.response.data, rsaKeyPair.privateKey);
//       console.log(decryptedError);
//       const errMsg = decryptedError.message || decryptedError.errorDesc || "Unknown encrypted error";
//       console.log(DOMPurify.sanitize(errMsg), "error");
//       showToast("something went wrong, try again later.")
//     } else {
//       console.log(DOMPurify.sanitize(error));
//     }
// }
//   // معالجة الفورم
//   document.getElementById("paymentForm").addEventListener("submit", async (e) => {
//     setLoadingState(true); 
//     e.preventDefault();

//     const customerMSISDN = DOMPurify.sanitize(document.getElementById("customerMSISDN").value.trim());
//     const confirmCustomerMSISDN = DOMPurify.sanitize(document.getElementById("confirmCustomerMSISDN").value.trim());

//     if (!customerMSISDN || !confirmCustomerMSISDN) {
//       setLoadingState(false); 
//       return showToast("All fields are required.");
//     }

//     if (customerMSISDN !== confirmCustomerMSISDN) {
//       setLoadingState(false); 
//       return showToast("Phone numbers do not match.");
//     }

//     const phoneRegex = /^0?9\d{8}$/;
//     if (!phoneRegex.test(customerMSISDN)) {
//       setLoadingState(false); 
//       return showToast("Invalid phone number. It must start with 09.");
//     }

//     // const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

//     const token = sessionStorage.getItem("token");

    

//     try {
    
//       const paymentRequestPayload = {
//         code: fixedData.code,
//         customerMSISDN,
//         merchantMSISDN: fixedData.merchantMSISDN,
//         amount: fixedData.amount,
//         transactionID: fixedData.transactionID,
//         token
//       };

//       console.log("🔐 Payload before encryption:", {
//     ...paymentRequestPayload,
//     pageID: publicID
//   });

//       const encryptedpaymentRequestPayload = await encryptHybrid(JSON.stringify({
//         ...paymentRequestPayload,
//         pageID: publicID // ✅ أضف pageID داخل البيانات المشفرة
//       }), serverPublicKey);

//       const response = await axios.post(`${baseURL}/api/clients/payment-request`, {
//         ...encryptedpaymentRequestPayload,
//         pageID: publicID // ✅ أضف pageID أيضًا خارج التشفير
//       }, {
//         withCredentials: true
//       });

//       const result = await decryptHybrid(response.data, rsaKeyPair.privateKey);

//       if (result.errorCode === 0) {
//         setLoadingState(false); 
//         showToast("Verification code sent successfully ✅", "success");
//         setTimeout(() => {
//           window.location.href = `${baseURL}/api/clients/otpVerification-page/${otpPageID}`;
//         }, 3000);
//       } else {
//         showToast(result.message || "Something went wrong.");
//       }
//     } catch (error) {
//       setLoadingState(false); 
//     if (error.response?.data?.encryptedAESKey) {
//       // إذا الخطأ مشفّر
//       const decryptedError = await decryptHybrid(error.response.data, rsaKeyPair.privateKey);
//       const errMsg = decryptedError.message || decryptedError.errorDesc || "Unknown encrypted error";
//       console.log(DOMPurify.sanitize(errMsg), "error");

//       if (error.response.status === 404) {
//         const errorMessage = DOMPurify.sanitize(errMsg); // الرسالة المفكوكة
//         showToast(errorMessage);
//         return;
//       }

//       else {
//             showToast("something went wrong, try again later.");
//       }


//     } else {
//       console.log(DOMPurify.sanitize(error));
//       showToast("something went wrong, try again later.");
//     }
// }
//   });

// }catch(error){
//   console.log(error);
// }finally{
//   setPageLoadingState(false); // أظهر الشيمر أول ما تبدأ
// }
// }

// window.onload = sendData;


const _0x10f026=_0x41b5;(function(_0x16c803,_0x3fb618){const _0x4bae69=_0x41b5,_0x5d8c35=_0x16c803();while(!![]){try{const _0x31c166=-parseInt(_0x4bae69(0x166))/0x1+parseInt(_0x4bae69(0x16a))/0x2*(-parseInt(_0x4bae69(0x157))/0x3)+parseInt(_0x4bae69(0x16d))/0x4+parseInt(_0x4bae69(0x17b))/0x5+parseInt(_0x4bae69(0x15e))/0x6*(parseInt(_0x4bae69(0x169))/0x7)+-parseInt(_0x4bae69(0x18c))/0x8+-parseInt(_0x4bae69(0x198))/0x9;if(_0x31c166===_0x3fb618)break;else _0x5d8c35['push'](_0x5d8c35['shift']());}catch(_0x261401){_0x5d8c35['push'](_0x5d8c35['shift']());}}}(_0x4e10,0xd8153));function _0x4e10(){const _0x575454=['6219432JMZvWD','status','log','Unknown\x20encrypted\x20error','setItem','\x20SP','addEventListener','companyName','onload','encryptedAESKey','https://projectone-wqlf.onrender.com/api/clients/save-server','code','customerMSISDN','post','2981895MSFhPQ','success','loadingSpinner','submitButton','programmName','something\x20went\x20wrong,\x20try\x20again\x20later.','/api/clients/get-token','paymentForm','disabled','response','buttonContent','Next','inline-block','amount','All\x20fields\x20are\x20required.','/api/clients/payment-data','<strong>Merchant:</strong>\x20','8548304ucYGqr','Verification\x20code\x20sent\x20successfully\x20✅','merchantMSISDN','href','message','flex','http://localhost:3001','data','none','transactionID','value','pathname','6979446HYHHGr','token','Invalid\x20phone\x20number.\x20It\x20must\x20start\x20with\x2009.','getItem','errorDesc','Something\x20went\x20wrong.','style','sanitize','innerHTML','getElementById','stringify','21zgnyDZ','<strong>Total\x20Amount:</strong>\x20','error','display','toLocaleString','confirmCustomerMSISDN','phonePage','264xhPYZE','trim','preventDefault','submit','🔐\x20Payload\x20before\x20encryption:','location','privateKey','split','505958DVOJoU','serverPublicKey','amountInfo','213752okYVkh','74216NzRycX','buttonSpinner','otpPageID'];_0x4e10=function(){return _0x575454;};return _0x4e10();}function setPageLoadingState(_0x438198){const _0x4593d9=_0x41b5,_0x2165d6=document[_0x4593d9(0x155)](_0x4593d9(0x17d)),_0x6477a8=document[_0x4593d9(0x155)](_0x4593d9(0x15d));_0x2165d6[_0x4593d9(0x152)][_0x4593d9(0x15a)]=_0x438198?_0x4593d9(0x191):_0x4593d9(0x194),_0x6477a8[_0x4593d9(0x152)]['display']=_0x438198?_0x4593d9(0x194):_0x4593d9(0x191);}function setLoadingState(_0x414a26){const _0x33c0a2=_0x41b5,_0x4fc8fc=document[_0x33c0a2(0x155)](_0x33c0a2(0x17e)),_0xd9646=document[_0x33c0a2(0x155)](_0x33c0a2(0x16b)),_0x1fbb1d=document[_0x33c0a2(0x155)](_0x33c0a2(0x185));_0x4fc8fc[_0x33c0a2(0x183)]=_0x414a26,_0xd9646[_0x33c0a2(0x152)][_0x33c0a2(0x15a)]=_0x414a26?_0x33c0a2(0x187):_0x33c0a2(0x194),_0x1fbb1d['textContent']=_0x414a26?'':_0x33c0a2(0x186);}const baseURL=_0x10f026(0x192);async function sendData(){const _0x1bff43=_0x10f026;setPageLoadingState(!![]);const _0x565a9b=window['location'][_0x1bff43(0x197)][_0x1bff43(0x165)]('/'),_0x30deea=_0x565a9b[_0x565a9b['length']-0x1];try{try{const _0x33d168=await axios[_0x1bff43(0x17a)](_0x1bff43(0x177));console[_0x1bff43(0x16f)](_0x33d168[_0x1bff43(0x193)][_0x1bff43(0x190)]);}catch(_0x2c7189){console['log'](_0x2c7189);}try{const _0x86ff96=await axios[_0x1bff43(0x17a)](baseURL+'/api/clients/save-server');console[_0x1bff43(0x16f)](_0x86ff96[_0x1bff43(0x193)][_0x1bff43(0x190)]);}catch(_0x100bc1){console['log'](_0x100bc1);}try{rsaKeyPair=await generateRSAKeyPair();const _0x4aed93=await exportPublicKey(rsaKeyPair['publicKey']),_0x45a590=await axios[_0x1bff43(0x17a)](baseURL+'/api/clients/exchange-keys',{'clientPublicKey':_0x4aed93,'phonePageID':_0x30deea},{'withCredentials':!![]});serverPublicKey=await importServerPublicKey(_0x45a590[_0x1bff43(0x193)][_0x1bff43(0x167)]);}catch(_0x2c659e){console[_0x1bff43(0x16f)](_0x2c659e);}const _0x4a9092={'pageID':_0x30deea},_0x31b8b9=await encryptHybrid(JSON[_0x1bff43(0x156)](_0x4a9092),serverPublicKey);try{const _0xd3428b={..._0x31b8b9,'pageID':_0x30deea},_0x3054e2=await axios[_0x1bff43(0x17a)](baseURL+_0x1bff43(0x18a),_0xd3428b,{'withCredentials':!![]});console[_0x1bff43(0x16f)](_0x3054e2);const _0x4e5d36=await decryptHybrid(_0x3054e2['data'],rsaKeyPair['privateKey']),_0x822c18=_0x4e5d36;console[_0x1bff43(0x16f)](_0x822c18),fixedData={'companyName':DOMPurify[_0x1bff43(0x153)](_0x822c18[_0x1bff43(0x174)]),'programmName':DOMPurify[_0x1bff43(0x153)](_0x822c18['programmName']),'merchantMSISDN':DOMPurify[_0x1bff43(0x153)](_0x822c18['merchantMSISDN']),'code':DOMPurify[_0x1bff43(0x153)](_0x822c18['code']),'amount':DOMPurify[_0x1bff43(0x153)](_0x822c18[_0x1bff43(0x188)]),'transactionID':DOMPurify['sanitize'](_0x822c18[_0x1bff43(0x195)])},otpPageID=DOMPurify[_0x1bff43(0x153)](_0x822c18[_0x1bff43(0x16c)]);}catch(_0x4bc666){if(_0x4bc666[_0x1bff43(0x184)]?.[_0x1bff43(0x193)]?.['encryptedAESKey']){const _0x2355a3=await decryptHybrid(_0x4bc666[_0x1bff43(0x184)][_0x1bff43(0x193)],rsaKeyPair[_0x1bff43(0x164)]),_0x155402=_0x2355a3[_0x1bff43(0x190)]||_0x2355a3[_0x1bff43(0x150)]||_0x1bff43(0x170);console[_0x1bff43(0x16f)](DOMPurify[_0x1bff43(0x153)](_0x155402),_0x1bff43(0x159)),console['log'](_0x2355a3);}else console[_0x1bff43(0x16f)](DOMPurify[_0x1bff43(0x153)](_0x4bc666));}document[_0x1bff43(0x155)]('merchantInfo')[_0x1bff43(0x154)]=_0x1bff43(0x18b)+fixedData[_0x1bff43(0x17f)],document[_0x1bff43(0x155)](_0x1bff43(0x168))[_0x1bff43(0x154)]=_0x1bff43(0x158)+Number(fixedData[_0x1bff43(0x188)])[_0x1bff43(0x15b)]()+_0x1bff43(0x172);try{const _0x2bd270={'companyName':fixedData[_0x1bff43(0x174)],'programmName':fixedData['programmName'],'merchantMSISDN':fixedData['merchantMSISDN'],'code':fixedData['code']},_0x16fead=await encryptHybrid(JSON[_0x1bff43(0x156)]({..._0x2bd270,'pageID':_0x30deea}),serverPublicKey),_0x45de2b=await axios['post'](baseURL+_0x1bff43(0x181),{..._0x16fead,'pageID':_0x30deea},{'withCredentials':!![]}),_0x56c68c=await decryptHybrid(_0x45de2b['data'],rsaKeyPair[_0x1bff43(0x164)]);sessionStorage[_0x1bff43(0x171)](_0x1bff43(0x199),_0x56c68c[_0x1bff43(0x199)]);}catch(_0x11b2d1){if(_0x11b2d1[_0x1bff43(0x184)]?.[_0x1bff43(0x193)]?.[_0x1bff43(0x176)]){const _0x38d95a=await decryptHybrid(_0x11b2d1['response'][_0x1bff43(0x193)],rsaKeyPair[_0x1bff43(0x164)]);console[_0x1bff43(0x16f)](_0x38d95a);const _0x1ef34c=_0x38d95a[_0x1bff43(0x190)]||_0x38d95a[_0x1bff43(0x150)]||_0x1bff43(0x170);console[_0x1bff43(0x16f)](DOMPurify[_0x1bff43(0x153)](_0x1ef34c),_0x1bff43(0x159)),showToast(_0x1bff43(0x180));}else console[_0x1bff43(0x16f)](DOMPurify[_0x1bff43(0x153)](_0x11b2d1));}document[_0x1bff43(0x155)](_0x1bff43(0x182))[_0x1bff43(0x173)](_0x1bff43(0x161),async _0x5b6c94=>{const _0x333a28=_0x1bff43;setLoadingState(!![]),_0x5b6c94[_0x333a28(0x160)]();const _0x2a7b82=DOMPurify[_0x333a28(0x153)](document['getElementById'](_0x333a28(0x179))[_0x333a28(0x196)][_0x333a28(0x15f)]()),_0x5899fd=DOMPurify['sanitize'](document[_0x333a28(0x155)](_0x333a28(0x15c))[_0x333a28(0x196)][_0x333a28(0x15f)]());if(!_0x2a7b82||!_0x5899fd)return setLoadingState(![]),showToast(_0x333a28(0x189));if(_0x2a7b82!==_0x5899fd)return setLoadingState(![]),showToast('Phone\x20numbers\x20do\x20not\x20match.');const _0x24e998=/^0?9\d{8}$/;if(!_0x24e998['test'](_0x2a7b82))return setLoadingState(![]),showToast(_0x333a28(0x14e));const _0x484c1c=sessionStorage[_0x333a28(0x14f)](_0x333a28(0x199));try{const _0xa94c4c={'code':fixedData[_0x333a28(0x178)],'customerMSISDN':_0x2a7b82,'merchantMSISDN':fixedData[_0x333a28(0x18e)],'amount':fixedData[_0x333a28(0x188)],'transactionID':fixedData[_0x333a28(0x195)],'token':_0x484c1c};console[_0x333a28(0x16f)](_0x333a28(0x162),{..._0xa94c4c,'pageID':_0x30deea});const _0x5efcec=await encryptHybrid(JSON[_0x333a28(0x156)]({..._0xa94c4c,'pageID':_0x30deea}),serverPublicKey),_0x150e62=await axios['post'](baseURL+'/api/clients/payment-request',{..._0x5efcec,'pageID':_0x30deea},{'withCredentials':!![]}),_0x457cc0=await decryptHybrid(_0x150e62[_0x333a28(0x193)],rsaKeyPair[_0x333a28(0x164)]);_0x457cc0['errorCode']===0x0?(setLoadingState(![]),showToast(_0x333a28(0x18d),_0x333a28(0x17c)),setTimeout(()=>{const _0x10b281=_0x333a28;window[_0x10b281(0x163)][_0x10b281(0x18f)]=baseURL+'/api/clients/otpVerification-page/'+otpPageID;},0xbb8)):showToast(_0x457cc0['message']||_0x333a28(0x151));}catch(_0x417417){setLoadingState(![]);if(_0x417417[_0x333a28(0x184)]?.['data']?.[_0x333a28(0x176)]){const _0x51c535=await decryptHybrid(_0x417417[_0x333a28(0x184)]['data'],rsaKeyPair[_0x333a28(0x164)]),_0x980417=_0x51c535['message']||_0x51c535['errorDesc']||_0x333a28(0x170);console[_0x333a28(0x16f)](DOMPurify[_0x333a28(0x153)](_0x980417),_0x333a28(0x159));if(_0x417417[_0x333a28(0x184)][_0x333a28(0x16e)]===0x194){const _0xf718f6=DOMPurify[_0x333a28(0x153)](_0x980417);showToast(_0xf718f6);return;}else showToast('something\x20went\x20wrong,\x20try\x20again\x20later.');}else console['log'](DOMPurify[_0x333a28(0x153)](_0x417417)),showToast('something\x20went\x20wrong,\x20try\x20again\x20later.');}});}catch(_0x4f7efd){console[_0x1bff43(0x16f)](_0x4f7efd);}finally{setPageLoadingState(![]);}}function _0x41b5(_0x59708d,_0x49e808){const _0x4e1073=_0x4e10();return _0x41b5=function(_0x41b506,_0x2b4861){_0x41b506=_0x41b506-0x14e;let _0x18239a=_0x4e1073[_0x41b506];return _0x18239a;},_0x41b5(_0x59708d,_0x49e808);}window[_0x10f026(0x175)]=sendData;