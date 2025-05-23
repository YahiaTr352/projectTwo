function setLoadingState(isLoading) {
  const button = document.getElementById("submitButton");
  const spinner = document.getElementById("buttonSpinner");
  const text = document.getElementById("buttonContent");

  button.disabled = isLoading;
  spinner.style.display = isLoading ? "inline-block" : "none";
  text.textContent = isLoading ? "" : "Next";
}

const baseURL = "https://projecttwo-iqjp.onrender.com";
// const baseURL = "http://localhost:3001";

async function sendData() {
          const pathParts = window.location.pathname.split("/");
        const publicID = pathParts[pathParts.length - 1];
  try {
    // توليد مفتاح RSA للمتصفح
    try{
    rsaKeyPair = await generateRSAKeyPair();
    const exportedPublicKey = await exportPublicKey(rsaKeyPair.publicKey);
    
    const resKey = await axios.post(`${baseURL}/api/clients/exchange-keys`, {
      clientPublicKey: exportedPublicKey, // ✅ تعديل الاسم
      phonePageID: publicID // ✅ أضف هذا
    }, {
      withCredentials: true
    });

    serverPublicKey = await importServerPublicKey(resKey.data.serverPublicKey);

    }catch(error){
      console.log(error);
    }

const payload = { pageID: publicID };
const encryptedPayload = await encryptHybrid(JSON.stringify(payload), serverPublicKey);

// 2. إرسال الطلب المشفر بـ POST
try{
const encryptedPayloadWithPageID = {
  ...encryptedPayload,
  pageID: publicID // ✅ أضفها داخل body
};

const res = await axios.post(`${baseURL}/api/clients/payment-data`, encryptedPayloadWithPageID, {
  withCredentials: true
});



console.log(res);

// 3. فك تشفير الاستجابة
const decrypted = await decryptHybrid(res.data, rsaKeyPair.privateKey);
const rawData = decrypted;

console.log(rawData);


// 4. تعقيم البيانات
fixedData = {
  companyName: DOMPurify.sanitize(rawData.companyName),
  programmName: DOMPurify.sanitize(rawData.programmName),
  merchantMSISDN: DOMPurify.sanitize(rawData.merchantMSISDN),
  code: DOMPurify.sanitize(rawData.code),
  amount: DOMPurify.sanitize(rawData.amount),
  transactionID: DOMPurify.sanitize(rawData.transactionID),
};
otpPageID = DOMPurify.sanitize(rawData.otpPageID);

} catch (error) {
    if (error.response?.data?.encryptedAESKey) {
      // إذا الخطأ مشفّر
      const decryptedError = await decryptHybrid(error.response.data, rsaKeyPair.privateKey);
      const errMsg = decryptedError.message || decryptedError.errorDesc || "Unknown encrypted error";
      console.log(DOMPurify.sanitize(errMsg), "error");
      console.log(decryptedError);
    }
     else {
      console.log(DOMPurify.sanitize(error));
    }
}


    // تشفير البيانات وإرسال طلب token
  const tokenPayload = {
      companyName: fixedData.companyName,
      programmName: fixedData.programmName,
      merchantMSISDN: fixedData.merchantMSISDN,
      code: fixedData.code
    };

    const encryptedToken = await encryptHybrid(JSON.stringify({
      ...tokenPayload,
      pageID: publicID
    }), serverPublicKey);

    const tokenRes = await axios.post(`${baseURL}/api/clients/get-token`, {
      ...encryptedToken,
      pageID: publicID
    }, { withCredentials: true });

    const result = await decryptHybrid(tokenRes.data, rsaKeyPair.privateKey);
    document.cookie = `token=${result.token}; path=/; SameSite=Lax`;


  } catch (error) {
    if (error.response?.data?.encryptedAESKey) {
      // إذا الخطأ مشفّر
      const decryptedError = await decryptHybrid(error.response.data, rsaKeyPair.privateKey);
      console.log(decryptedError);
      const errMsg = decryptedError.message || decryptedError.errorDesc || "Unknown encrypted error";
      console.log(DOMPurify.sanitize(errMsg), "error");
      showToast("something went wrong, try again later.")
    } else {
      console.log(DOMPurify.sanitize(error));
    }
}
  // معالجة الفورم
  document.getElementById("paymentForm").addEventListener("submit", async (e) => {
    setLoadingState(true); 
    e.preventDefault();

    const customerMSISDN = DOMPurify.sanitize(document.getElementById("customerMSISDN").value.trim());
    const confirmCustomerMSISDN = DOMPurify.sanitize(document.getElementById("confirmCustomerMSISDN").value.trim());

    if (!customerMSISDN || !confirmCustomerMSISDN) {
      setLoadingState(false); 
      return showToast("All fields are required.");
    }

    if (customerMSISDN !== confirmCustomerMSISDN) {
      setLoadingState(false); 
      return showToast("Phone numbers do not match.");
    }

    const phoneRegex = /^0?9\d{8}$/;
    if (!phoneRegex.test(customerMSISDN)) {
      setLoadingState(false); 
      return showToast("Invalid phone number. It must start with 09.");
    }

    const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];

    try {
    
      const paymentRequestPayload = {
        code: fixedData.code,
        customerMSISDN,
        merchantMSISDN: fixedData.merchantMSISDN,
        amount: fixedData.amount,
        transactionID: fixedData.transactionID,
        token
      };


      const encryptedpaymentRequestPayload = await encryptHybrid(JSON.stringify({
        ...paymentRequestPayload,
        pageID: publicID // ✅ أضف pageID داخل البيانات المشفرة
      }), serverPublicKey);

      const response = await axios.post(`${baseURL}/api/clients/payment-request`, {
        ...encryptedpaymentRequestPayload,
        pageID: publicID // ✅ أضف pageID أيضًا خارج التشفير
      }, {
        withCredentials: true
      });

      const result = await decryptHybrid(response.data, rsaKeyPair.privateKey);

      if (result.errorCode === 0) {
        setLoadingState(false); 
        showToast("Verification code sent successfully ✅", "success");
        setTimeout(() => {
          window.location.href = `${baseURL}/api/clients/otpVerification-page/${otpPageID}`;
        }, 3000);
      } else {
        showToast(result.message || "Something went wrong.");
      }
    } catch (error) {
      setLoadingState(false); 
    if (error.response?.data?.encryptedAESKey) {
      // إذا الخطأ مشفّر
      const decryptedError = await decryptHybrid(error.response.data, rsaKeyPair.privateKey);
      const errMsg = decryptedError.message || decryptedError.errorDesc || "Unknown encrypted error";
      console.log(DOMPurify.sanitize(errMsg), "error");

      if (error.response.status === 404) {
        const errorMessage = DOMPurify.sanitize(errMsg); // الرسالة المفكوكة
        showToast(errorMessage);
        return;
      }

      else {
            showToast("something went wrong, try again later.");
      }


    } else {
      console.log(DOMPurify.sanitize(error));
      showToast("something went wrong, try again later.");
    }
}
  });
}

window.onload = sendData;


