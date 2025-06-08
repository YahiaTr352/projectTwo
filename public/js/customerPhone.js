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
//     rsaKeyPair = await generateRSAKeyPair();
//     const exportedPublicKey = await exportPublicKey(rsaKeyPair.publicKey);
//     console.log(exportedPublicKey);
    
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

// // const payload = { pageID: publicID };
// // const encryptedPayload = await encryptHybrid(JSON.stringify(payload), serverPublicKey);

// // 2. إرسال الطلب المشفر بـ POST
// try{
  
// const encryptedPayloadWithPageID = {
//   pageID: publicID // ✅ أضفها داخل body
// };

// const res = await axios.post(`${baseURL}/api/clients/payment-data`, encryptedPayloadWithPageID, {
//   withCredentials: true
// });



// console.log(res);

// // 3. فك تشفير الاستجابة
//  console.log("Encrypted response:", res.data);
//   console.log("🔐 rsaKeyPair.privateKey:", rsaKeyPair.privateKey);

//   const decrypted = await decryptHybrid(res.data, rsaKeyPair.privateKey);

//   console.log("Decrypted data raw:", decrypted);
//   console.log("Type of decrypted:", typeof decrypted);

//   let rawData;
//   if (typeof decrypted === "string") {
//     rawData = JSON.parse(decrypted);
//   } else {
//     rawData = decrypted;
//   }

//   if (!rawData || !rawData.programmName) {
//     return showToast("Something went wrong, please try again later.");
//   }


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
//     }, { withCredentials: true}
//     );

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

function setPageLoadingState(_0x2c6e7f){const _0x59ff27=document['getElementById']('loadingSpinner');const _0x450607=document['getElementById']('phonePage');_0x59ff27['style']['display']=_0x2c6e7f?'flex':'none';_0x450607['style']['display']=_0x2c6e7f?'none':'flex';}function setLoadingState(_0x449453){const _0x51b803=document['getElementById']('submitButton');const _0x316f5a=document['getElementById']('buttonSpinner');const _0x1f5e97=document['getElementById']('buttonContent');_0x51b803['disabled']=_0x449453;_0x316f5a['style']['display']=_0x449453?'inline-block':'none';_0x1f5e97['textContent']=_0x449453?'':'Next';}const baseURL='http://localhost:3001';async function sendData(){setPageLoadingState(!![]);const _0x32af09=window['location']['pathname']['split']('/');const _0x1e7705=_0x32af09[_0x32af09['length']-0x1];try{try{rsaKeyPair=await generateRSAKeyPair();const _0x409c9d=await exportPublicKey(rsaKeyPair['publicKey']);console['log'](_0x409c9d);const _0x1bf87b=await axios['post'](baseURL+'/api/clients/exchange-keys',{'clientPublicKey':_0x409c9d,'phonePageID':_0x1e7705},{'withCredentials':!![]});serverPublicKey=await importServerPublicKey(_0x1bf87b['data']['serverPublicKey']);}catch(_0x2c2904){console['log'](_0x2c2904);}try{const _0x5263ee={'pageID':_0x1e7705};const _0x26fcae=await axios['post'](baseURL+'/api/clients/payment-data',_0x5263ee,{'withCredentials':!![]});console['log'](_0x26fcae);console['log']('Encrypted\x20response:',_0x26fcae['data']);console['log']('🔐\x20rsaKeyPair.privateKey:',rsaKeyPair['privateKey']);const _0x4b81dc=await decryptHybrid(_0x26fcae['data'],rsaKeyPair['privateKey']);console['log']('Decrypted\x20data\x20raw:',_0x4b81dc);console['log']('Type\x20of\x20decrypted:',typeof _0x4b81dc);let _0x109ef7;if(typeof _0x4b81dc==='string'){_0x109ef7=JSON['parse'](_0x4b81dc);}else{_0x109ef7=_0x4b81dc;}if(!_0x109ef7||!_0x109ef7['programmName']){return showToast('Something\x20went\x20wrong,\x20please\x20try\x20again\x20later.');}fixedData={'companyName':DOMPurify['sanitize'](_0x109ef7['companyName']),'programmName':DOMPurify['sanitize'](_0x109ef7['programmName']),'merchantMSISDN':DOMPurify['sanitize'](_0x109ef7['merchantMSISDN']),'code':DOMPurify['sanitize'](_0x109ef7['code']),'amount':DOMPurify['sanitize'](_0x109ef7['amount']),'transactionID':DOMPurify['sanitize'](_0x109ef7['transactionID'])};otpPageID=DOMPurify['sanitize'](_0x109ef7['otpPageID']);}catch(_0x27e12a){if(_0x27e12a['response']?.['data']?.['encryptedAESKey']){const _0x3b2e4d=await decryptHybrid(_0x27e12a['response']['data'],rsaKeyPair['privateKey']);const _0x212225=_0x3b2e4d['message']||_0x3b2e4d['errorDesc']||'Unknown\x20encrypted\x20error';console['log'](DOMPurify['sanitize'](_0x212225),'error');console['log'](_0x3b2e4d);}else{console['log'](DOMPurify['sanitize'](_0x27e12a));}}document['getElementById']('merchantInfo')['innerHTML']='<strong>Merchant:</strong>\x20'+fixedData['programmName'];document['getElementById']('amountInfo')['innerHTML']='<strong>Total\x20Amount:</strong>\x20'+Number(fixedData['amount'])['toLocaleString']()+'\x20SP';try{const _0x125b46={'companyName':fixedData['companyName'],'programmName':fixedData['programmName'],'merchantMSISDN':fixedData['merchantMSISDN'],'code':fixedData['code']};const _0x614880=await encryptHybrid(JSON['stringify']({..._0x125b46,'pageID':_0x1e7705}),serverPublicKey);const _0x17ce21=await axios['post'](baseURL+'/api/clients/get-token',{..._0x614880,'pageID':_0x1e7705},{'withCredentials':!![]});const _0x50ef09=await decryptHybrid(_0x17ce21['data'],rsaKeyPair['privateKey']);sessionStorage['setItem']('token',_0x50ef09['token']);}catch(_0x33c434){if(_0x33c434['response']?.['data']?.['encryptedAESKey']){const _0x3ef904=await decryptHybrid(_0x33c434['response']['data'],rsaKeyPair['privateKey']);console['log'](_0x3ef904);const _0x409e91=_0x3ef904['message']||_0x3ef904['errorDesc']||'Unknown\x20encrypted\x20error';console['log'](DOMPurify['sanitize'](_0x409e91),'error');showToast('something\x20went\x20wrong,\x20try\x20again\x20later.');}else{console['log'](DOMPurify['sanitize'](_0x33c434));}}document['getElementById']('paymentForm')['addEventListener']('submit',async _0x37a909=>{setLoadingState(!![]);_0x37a909['preventDefault']();const _0xe7429b=DOMPurify['sanitize'](document['getElementById']('customerMSISDN')['value']['trim']());const _0x557d4a=DOMPurify['sanitize'](document['getElementById']('confirmCustomerMSISDN')['value']['trim']());if(!_0xe7429b||!_0x557d4a){setLoadingState(![]);return showToast('All\x20fields\x20are\x20required.');}if(_0xe7429b!==_0x557d4a){setLoadingState(![]);return showToast('Phone\x20numbers\x20do\x20not\x20match.');}const _0x2fec4f=/^0?9\d{8}$/;if(!_0x2fec4f['test'](_0xe7429b)){setLoadingState(![]);return showToast('Invalid\x20phone\x20number.\x20It\x20must\x20start\x20with\x2009.');}const _0x2353a8=sessionStorage['getItem']('token');try{const _0x4da530={'code':fixedData['code'],'customerMSISDN':_0xe7429b,'merchantMSISDN':fixedData['merchantMSISDN'],'amount':fixedData['amount'],'transactionID':fixedData['transactionID'],'token':_0x2353a8};console['log']('🔐\x20Payload\x20before\x20encryption:',{..._0x4da530,'pageID':_0x1e7705});const _0x5010ac=await encryptHybrid(JSON['stringify']({..._0x4da530,'pageID':_0x1e7705}),serverPublicKey);const _0x54cf8e=await axios['post'](baseURL+'/api/clients/payment-request',{..._0x5010ac,'pageID':_0x1e7705},{'withCredentials':!![]});const _0x33b306=await decryptHybrid(_0x54cf8e['data'],rsaKeyPair['privateKey']);if(_0x33b306['errorCode']===0x0){setLoadingState(![]);showToast('Verification\x20code\x20sent\x20successfully\x20✅','success');setTimeout(()=>{window['location']['href']=baseURL+'/api/clients/otpVerification-page/'+otpPageID;},0xbb8);}else{showToast(_0x33b306['message']||'Something\x20went\x20wrong.');}}catch(_0x44e7f4){setLoadingState(![]);if(_0x44e7f4['response']?.['data']?.['encryptedAESKey']){const _0x24aca8=await decryptHybrid(_0x44e7f4['response']['data'],rsaKeyPair['privateKey']);const _0xcad575=_0x24aca8['message']||_0x24aca8['errorDesc']||'Unknown\x20encrypted\x20error';console['log'](DOMPurify['sanitize'](_0xcad575),'error');if(_0x44e7f4['response']['status']===0x194){const _0xe6ec62=DOMPurify['sanitize'](_0xcad575);showToast(_0xe6ec62);return;}else{showToast('something\x20went\x20wrong,\x20try\x20again\x20later.');}}else{console['log'](DOMPurify['sanitize'](_0x44e7f4));showToast('something\x20went\x20wrong,\x20try\x20again\x20later.');}}});}catch(_0x4880de){console['log'](_0x4880de);}finally{setPageLoadingState(![]);}}window['onload']=sendData;