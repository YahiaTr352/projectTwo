
// let rsaKeyPair;
// let serverPublicKey;
// let otpPageID = "";
// let fixedData;


// function b64ToArrayBuffer(b64) {
//   // إزالة الترويسات والأسطر الجديدة
//   const cleaned = b64
//     .replace(/-----BEGIN PUBLIC KEY-----/, '')
//     .replace(/-----END PUBLIC KEY-----/, '')
//     .replace(/\n/g, '')
//     .replace(/\r/g, '')
//     .trim();

//   const binaryString = window.atob(cleaned);
//   const len = binaryString.length;
//   const bytes = new Uint8Array(len);
//   for (let i = 0; i < len; i++) {
//     bytes[i] = binaryString.charCodeAt(i);
//   }
//   return bytes.buffer;
// }


// function arrayBufferToB64(buffer) {
//   const binary = String.fromCharCode(...new Uint8Array(buffer));
//   return btoa(binary);
// }

// async function generateRSAKeyPair() {
//   return await crypto.subtle.generateKey(
//     {
//       name: "RSA-OAEP",
//       modulusLength: 2048,
//       publicExponent: new Uint8Array([1, 0, 1]),
//       hash: "SHA-256",
//     },
//     true,
//     ["encrypt", "decrypt"]
//   );
// }

// async function exportPublicKey(key) {
//   const spki = await crypto.subtle.exportKey("spki", key);
//   return arrayBufferToB64(spki);
// }

// async function importServerPublicKey(b64Key) {
//   const spki = b64ToArrayBuffer(b64Key);
//   return await crypto.subtle.importKey(
//     "spki",
//     spki,
//     { name: "RSA-OAEP", hash: "SHA-256" },
//     true,
//     ["encrypt"]
//   );
// }

// async function encryptHybrid(data, serverPublicKey) {
//   const aesKey = await crypto.subtle.generateKey(
//     { name: "AES-GCM", length: 256 },
//     true,
//     ["encrypt", "decrypt"]
//   );

//   const iv = crypto.getRandomValues(new Uint8Array(12));
//   const encoder = new TextEncoder();
//   const encoded = encoder.encode(JSON.stringify(data));

//   const fullCiphertextBuffer = await crypto.subtle.encrypt(
//     { name: "AES-GCM", iv },
//     aesKey,
//     encoded
//   );

//   // تقسيم الـ ciphertext + authTag
//   const fullCiphertext = new Uint8Array(fullCiphertextBuffer);
//   const authTag = fullCiphertext.slice(-16); // آخر 16 بايت
//   const ciphertext = fullCiphertext.slice(0, -16); // باقي البيانات

//   const rawAESKey = await crypto.subtle.exportKey("raw", aesKey);
//   const encryptedAESKey = await crypto.subtle.encrypt(
//     { name: "RSA-OAEP" },
//     serverPublicKey,
//     rawAESKey
//   );

//   return {
//     ciphertext: arrayBufferToB64(ciphertext.buffer),
//     encryptedAESKey: arrayBufferToB64(encryptedAESKey),
//     iv: arrayBufferToB64(iv.buffer),
//     authTag: arrayBufferToB64(authTag.buffer), // ✅ مهم جدًا
//   };
// }


// async function decryptHybrid(encryptedData, privateKey) {
//   const { ciphertext, encryptedAESKey, iv, authTag } = encryptedData;

//   const aesKeyRaw = await crypto.subtle.decrypt(
//     { name: "RSA-OAEP" },
//     privateKey,
//     b64ToArrayBuffer(encryptedAESKey)
//   );

//   const aesKey = await crypto.subtle.importKey(
//     "raw",
//     aesKeyRaw,
//     { name: "AES-GCM" },
//     false,
//     ["decrypt"]
//   );

//   // دمج ciphertext + authTag كما كان عند التشفير
//   const ct = new Uint8Array(b64ToArrayBuffer(ciphertext));
//   const at = new Uint8Array(b64ToArrayBuffer(authTag));
//   const combined = new Uint8Array(ct.length + at.length);
//   combined.set(ct);
//   combined.set(at, ct.length);

//   const decrypted = await crypto.subtle.decrypt(
//     { name: "AES-GCM", iv: b64ToArrayBuffer(iv) },
//     aesKey,
//     combined.buffer
//   );

//   const decoder = new TextDecoder();
//   return JSON.parse(decoder.decode(decrypted));
// }

// .................................................................................................

// let rsaKeyPair;
// let serverPublicKey;
// let otpPageID = "";
// let fixedData;


// function b64ToArrayBuffer(b64) {
//   // إزالة الترويسات والأسطر الجديدة
//   const cleaned = b64
//     .replace(/-----BEGIN PUBLIC KEY-----/, '')
//     .replace(/-----END PUBLIC KEY-----/, '')
//     .replace(/\n/g, '')
//     .replace(/\r/g, '')
//     .trim();

//   const binaryString = window.atob(cleaned);
//   const len = binaryString.length;
//   const bytes = new Uint8Array(len);
//   for (let i = 0; i < len; i++) {
//     bytes[i] = binaryString.charCodeAt(i);
//   }
//   return bytes.buffer;
// }


// function arrayBufferToB64(buffer) {
//   const binary = String.fromCharCode(...new Uint8Array(buffer));
//   return btoa(binary);
// }

// async function generateRSAKeyPair() {
//   return await crypto.subtle.generateKey(
//     {
//       name: "RSA-OAEP",
//       modulusLength: 2048,
//       publicExponent: new Uint8Array([1, 0, 1]),
//       hash: "SHA-256",
//     },
//     true,
//     ["encrypt", "decrypt"]
//   );
// }

// async function exportPublicKey(key) {
//   const spki = await crypto.subtle.exportKey("spki", key);
//   return arrayBufferToB64(spki);
// }

// async function importServerPublicKey(b64Key) {
//   const spki = b64ToArrayBuffer(b64Key);
//   return await crypto.subtle.importKey(
//     "spki",
//     spki,
//     { name: "RSA-OAEP", hash: "SHA-256" },
//     true,
//     ["encrypt"]
//   );
// }

// async function encryptHybrid(data, serverPublicKey) {
//   const aesKey = await crypto.subtle.generateKey(
//     { name: "AES-GCM", length: 256 },
//     true,
//     ["encrypt", "decrypt"]
//   );

//   const iv = crypto.getRandomValues(new Uint8Array(12));
//   const encoder = new TextEncoder();
//   const encoded = encoder.encode(JSON.stringify(data));

//   const fullCiphertextBuffer = await crypto.subtle.encrypt(
//     { name: "AES-GCM", iv },
//     aesKey,
//     encoded
//   );

//   // تقسيم الـ ciphertext + authTag
//   const fullCiphertext = new Uint8Array(fullCiphertextBuffer);
//   const authTag = fullCiphertext.slice(-16); // آخر 16 بايت
//   const ciphertext = fullCiphertext.slice(0, -16); // باقي البيانات

//   const rawAESKey = await crypto.subtle.exportKey("raw", aesKey);
//   const encryptedAESKey = await crypto.subtle.encrypt(
//     { name: "RSA-OAEP" },
//     serverPublicKey,
//     rawAESKey
//   );

//   return {
//     ciphertext: arrayBufferToB64(ciphertext.buffer),
//     encryptedAESKey: arrayBufferToB64(encryptedAESKey),
//     iv: arrayBufferToB64(iv.buffer),
//     authTag: arrayBufferToB64(authTag.buffer), // ✅ مهم جدًا
//   };
// }


// async function decryptHybrid(encryptedData, privateKey) {
//   const { ciphertext, encryptedAESKey, iv, authTag } = encryptedData;

//   const aesKeyRaw = await crypto.subtle.decrypt(
//     { name: "RSA-OAEP" },
//     privateKey,
//     b64ToArrayBuffer(encryptedAESKey)
//   );

//   const aesKey = await crypto.subtle.importKey(
//     "raw",
//     aesKeyRaw,
//     { name: "AES-GCM" },
//     false,
//     ["decrypt"]
//   );

//   // دمج ciphertext + authTag كما كان عند التشفير
//   const ct = new Uint8Array(b64ToArrayBuffer(ciphertext));
//   const at = new Uint8Array(b64ToArrayBuffer(authTag));
//   const combined = new Uint8Array(ct.length + at.length);
//   combined.set(ct);
//   combined.set(at, ct.length);

//   const decrypted = await crypto.subtle.decrypt(
//     { name: "AES-GCM", iv: b64ToArrayBuffer(iv) },
//     aesKey,
//     combined.buffer
//   );

//   const decoder = new TextDecoder();
//   return JSON.parse(decoder.decode(decrypted));
// }

let rsaKeyPair;
let serverPublicKey;
let otpPageID = "";
let fixedData;

// =====================
// 🧱 IndexedDB Functions
// =====================
function openKeyDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("cryptoKeysDB", 1);
    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("keys")) {
        db.createObjectStore("keys");
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function savePrivateKeyToDB(privateKey) {
  const db = await openKeyDB();
  const tx = db.transaction("keys", "readwrite");
  const store = tx.objectStore("keys");
  store.put(privateKey, "privateKey");
  await tx.done;
  db.close();
}

async function loadPrivateKeyFromDB() {
  const db = await openKeyDB();
  const tx = db.transaction("keys", "readonly");
  const store = tx.objectStore("keys");
  return new Promise((resolve, reject) => {
    const request = store.get("privateKey");
    request.onsuccess = () => {
      db.close();
      resolve(request.result);
    };
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

// =====================
// 🔑 Key Management
// =====================
function b64ToArrayBuffer(b64) {
  const cleaned = b64
    .replace(/-----BEGIN PUBLIC KEY-----/, '')
    .replace(/-----END PUBLIC KEY-----/, '')
    .replace(/\n/g, '')
    .replace(/\r/g, '')
    .trim();

  const binaryString = window.atob(cleaned);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

function arrayBufferToB64(buffer) {
  const binary = String.fromCharCode(...new Uint8Array(buffer));
  return btoa(binary);
}

async function generateRSAKeyPair() {
  return await crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    false, // ❌ Not extractable
    ["encrypt", "decrypt"]
  );
}

async function exportPublicKey(key) {
  const spki = await crypto.subtle.exportKey("spki", key);
  return arrayBufferToB64(spki);
}

async function importServerPublicKey(b64Key) {
  const spki = b64ToArrayBuffer(b64Key);
  return await crypto.subtle.importKey(
    "spki",
    spki,
    { name: "RSA-OAEP", hash: "SHA-256" },
    true,
    ["encrypt"]
  );
}

async function initializeKeys() {
  const privateKey = await loadPrivateKeyFromDB();
  if (privateKey) {
    rsaKeyPair = { privateKey };
    console.log("✅ Loaded private key from IndexedDB");
  } else {
    rsaKeyPair = await generateRSAKeyPair();
    await savePrivateKeyToDB(rsaKeyPair.privateKey);
    console.log("🔐 Generated and stored new key pair");
  }
}

// =====================
// 🔐 Hybrid Encryption
// =====================
async function encryptHybrid(data, serverPublicKey) {
  const aesKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const encoded = encoder.encode(JSON.stringify(data));

  const fullCiphertextBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encoded
  );

  const fullCiphertext = new Uint8Array(fullCiphertextBuffer);
  const authTag = fullCiphertext.slice(-16);
  const ciphertext = fullCiphertext.slice(0, -16);

  const rawAESKey = await crypto.subtle.exportKey("raw", aesKey);
  const encryptedAESKey = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    serverPublicKey,
    rawAESKey
  );

  return {
    ciphertext: arrayBufferToB64(ciphertext.buffer),
    encryptedAESKey: arrayBufferToB64(encryptedAESKey),
    iv: arrayBufferToB64(iv.buffer),
    authTag: arrayBufferToB64(authTag.buffer),
  };
}

async function decryptHybrid(encryptedData, privateKey) {
  const { ciphertext, encryptedAESKey, iv, authTag } = encryptedData;

  const aesKeyRaw = await crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    b64ToArrayBuffer(encryptedAESKey)
  );

  const aesKey = await crypto.subtle.importKey(
    "raw",
    aesKeyRaw,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  const ct = new Uint8Array(b64ToArrayBuffer(ciphertext));
  const at = new Uint8Array(b64ToArrayBuffer(authTag));
  const combined = new Uint8Array(ct.length + at.length);
  combined.set(ct);
  combined.set(at, ct.length);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: b64ToArrayBuffer(iv) },
    aesKey,
    combined.buffer
  );

  const decoder = new TextDecoder();
  return JSON.parse(decoder.decode(decrypted));
}
