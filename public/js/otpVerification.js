

function setLoadingState(isLoading) {
  const button = document.getElementById("submitButton");
  const spinner = document.getElementById("buttonSpinner");
  const text = document.getElementById("buttonContent");

  button.disabled = isLoading;
  spinner.style.display = isLoading ? "inline-block" : "none";
  text.textContent = isLoading ? "" : "Next";
}

const pathParts = window.location.pathname.split("/");
const publicID = pathParts[pathParts.length - 1];
window.addEventListener("DOMContentLoaded", async () => {
  // const baseURL = "https://projecttwo-iqjp.onrender.com";
    const baseURL = "http://localhost:3001";
  let fixedData;
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
console.log("📦 Decrypted response:", decrypted);
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
  otp: DOMPurify.sanitize(rawData.otp),
};
// otpPageID = DOMPurify.sanitize(rawData.otpPageID);

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

  // ✅ عرض OTP في toast للتجريب
  // console.log(`OTP is: ${fixedData.otp}`);
  showToast(`Your verification code is: ${fixedData.otp}`, "success", 10000);

  // ✅ قراءة التوكن من الكوكيز
  // function getCookie(name) {
  //   const cookies = document.cookie.split("; ");
  //   const found = cookies.find(row => row.startsWith(name + "="));
  //   return found ? found.split("=")[1] : null;
  // }

  const token = sessionStorage.getItem("token");

  const inputs = document.querySelectorAll(".otp-inputs input");
  const resendBtn = document.getElementById("resendBtn");
  const form = document.getElementById("otpForm");

  // ✅ التنقل بين خانات الإدخال
  inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
      if (input.value.length === 1 && index < inputs.length - 1) {
        inputs[index + 1].focus();
      }
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !input.value && index > 0) {
        inputs[index - 1].focus();
      }
    });
  });

  // ✅ التحقق من رمز OTP عند الإرسال
  form.addEventListener("submit", async (e) => {
    setLoadingState(true); 
    e.preventDefault();

    const otpCode = DOMPurify.sanitize(Array.from(inputs).map(input => input.value).join(""));

    if (otpCode.length !== 6 || !/^\d{6}$/.test(otpCode)) {
      showToast("Please enter a valid 6-digit OTP.");
      return;
    }

        const paymentConfirmationPayload ={
          code: fixedData.code,
          merchantMSISDN: fixedData.merchantMSISDN,
          transactionID: fixedData.transactionID,
          OTP: otpCode,
          token
    };

  const encryptedPaymentConfirmationPayload = await encryptHybrid(JSON.stringify({
    ...paymentConfirmationPayload,
    pageID: publicID // ✅ أضف pageID داخل البيانات المشفرة
  }), serverPublicKey);


    try {
  const confirmRes = await axios.post(`${baseURL}/api/clients/payment-confirmation`, {
    ...encryptedPaymentConfirmationPayload,
    pageID: publicID // ✅ أضف pageID أيضًا خارج التشفير
  }, {
    withCredentials: true
  });
const decryptedConfirmRes = await decryptHybrid(confirmRes.data, rsaKeyPair.privateKey);


if (decryptedConfirmRes.errorCode === 0) {
  setLoadingState(false); 
  showToast("OTP verified successfully! ✅", "success");

  // ثم نرسل getRedirct-url كالمعتاد

         const redirectUrlPayload ={
        companyName: fixedData.companyName,
        programmName: fixedData.programmName,
        code: fixedData.code
    };

  const encryptedRedirectUrlPayload = await encryptHybrid(JSON.stringify({
    ...redirectUrlPayload,
    pageID: publicID // ✅ أضف pageID داخل البيانات المشفرة
  }), serverPublicKey);


    try{

  const urlResponse = await axios.post(`${baseURL}/api/clients/getRedirct-url`, {
    ...encryptedRedirectUrlPayload,
    pageID: publicID // ✅ أضف pageID أيضًا خارج التشفير
  }, {
    withCredentials: true
  });

    const decryptedUrlResponse = await decryptHybrid(urlResponse.data, rsaKeyPair.privateKey);

   if (decryptedUrlResponse.url) {
    window.location.href = decryptedUrlResponse.url;
  } else {
    showToast("URL not found for this transaction.");
  }
  }catch (error) {
    if (error.response?.data?.encryptedAESKey) {
      // إذا الخطأ مشفّر
      const decryptedError = await decryptHybrid(error.response.data, rsaKeyPair.privateKey);
      const errMsg = decryptedError.message || decryptedError.errorDesc || "Unknown encrypted error";
      console.log(DOMPurify.sanitize(errMsg), "error");
    }
    else {
      console.log("Unexpected error occurred", "error");
    }
}

} 

} catch (error) {
    setLoadingState(false); 
    if (error.response?.data?.encryptedAESKey) {
      // إذا الخطأ مشفّر
      const decryptedError = await decryptHybrid(error.response.data, rsaKeyPair.privateKey);
      const errMsg = decryptedError.message || decryptedError.errorDesc || "Unknown encrypted error";
      console.log(DOMPurify.sanitize(errMsg), "error");

    if(error.response.status === 404 || 405 || 406 || 407 || 408 || 410 ){
            const errorMessage = DOMPurify.sanitize(errMsg);
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

  // ✅ إعادة إرسال OTP
  resendBtn.addEventListener("click", async () => {
    if (resendBtn.classList.contains("disabled")) return;

    resendBtn.classList.add("disabled");
    let seconds = 60;
    resendBtn.textContent = `Resend OTP in ${seconds}s`;

    const timerInterval = setInterval(() => {
      seconds--;
      resendBtn.textContent = `Resend OTP in ${seconds}s`;
      if (seconds <= 0) {
        clearInterval(timerInterval);
        resendBtn.classList.remove("disabled");
        resendBtn.textContent = "Resend OTP";
      }
    }, 1000);

            const resendOtpPayload ={
        code: fixedData.code,
        merchantMSISDN: fixedData.merchantMSISDN,
        transactionID: fixedData.transactionID,
        token
    };

  const encryptedresendOtpPayload = await encryptHybrid(JSON.stringify({
    ...resendOtpPayload,
    pageID: publicID // ✅ أضف pageID داخل البيانات المشفرة
  }), serverPublicKey);



    try {
    const response = await axios.post(`${baseURL}/api/clients/resend-otp`, {
      ...encryptedresendOtpPayload,
      pageID: publicID // ✅ أضف pageID أيضًا خارج التشفير
    }, {
      withCredentials: true
    });

    const decryptedResendOtp = await decryptHybrid(response.data, rsaKeyPair.privateKey);

      if (decryptedResendOtp.errorCode === 0) {
        const newOtp = DOMPurify.sanitize(decryptedResendOtp.otp);
        showToast("New verification code sent successfully ✅", "success");
      } 
    }catch (error) {
    if (error.response?.data?.encryptedAESKey) {
      // إذا الخطأ مشفّر
      const decryptedError = await decryptHybrid(error.response.data, rsaKeyPair.privateKey);
      const errMsg = decryptedError.message || decryptedError.errorDesc || "Unknown encrypted error";
      console.log(DOMPurify.sanitize(errMsg), "error");

      if (error.response && [405 , 410].includes(error.response.status)) {
        clearInterval(timerInterval);
        resendBtn.classList.remove("disabled");
        resendBtn.textContent = "Resend OTP";
        const errorMessage = DOMPurify.sanitize(errMsg);
        showToast(errorMessage);
        return;

      } else {
      clearInterval(timerInterval);
      resendBtn.classList.remove("disabled");
      resendBtn.textContent = "Resend OTP";
      showToast("Something went wrong, try again later.");
      }
    } else {
      console.log(DOMPurify.sanitize(error));
      showToast("something went wrong, try again later.");
    }
}
  });
});

