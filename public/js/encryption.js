
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

// let rsaKeyPair;
// let serverPublicKey;
// let otpPageID = "";
// let fixedData;

// // =====================
// // 🧱 IndexedDB Functions
// // =====================
// function openKeyDB() {
//   return new Promise((resolve, reject) => {
//     const request = indexedDB.open("cryptoKeysDB", 1);
//     request.onupgradeneeded = function (event) {
//       const db = event.target.result;
//       if (!db.objectStoreNames.contains("keys")) {
//         db.createObjectStore("keys");
//       }
//     };
//     request.onsuccess = () => resolve(request.result);
//     request.onerror = () => reject(request.error);
//   });
// }

// async function savePrivateKeyToDB(privateKey) {
//   const db = await openKeyDB();
//   const tx = db.transaction("keys", "readwrite");
//   const store = tx.objectStore("keys");
//   store.put(privateKey, "privateKey");
//   await tx.done;
//   db.close();
// }

// async function loadPrivateKeyFromDB() {
//   const db = await openKeyDB();
//   const tx = db.transaction("keys", "readonly");
//   const store = tx.objectStore("keys");
//   return new Promise((resolve, reject) => {
//     const request = store.get("privateKey");
//     request.onsuccess = () => {
//       db.close();
//       resolve(request.result);
//     };
//     request.onerror = () => {
//       db.close();
//       reject(request.error);
//     };
//   });
// }

// // =====================
// // 🔑 Key Management
// // =====================
// function b64ToArrayBuffer(b64) {
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
//     false, // ❌ Not extractable
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

// async function initializeKeys() {
//   const privateKey = await loadPrivateKeyFromDB();
//   if (privateKey) {
//     rsaKeyPair = { privateKey };
//     console.log("✅ Loaded private key from IndexedDB");
//   } else {
//     rsaKeyPair = await generateRSAKeyPair();
//     await savePrivateKeyToDB(rsaKeyPair.privateKey);
//     console.log("🔐 Generated and stored new key pair");
//   }
// }

// // =====================
// // 🔐 Hybrid Encryption
// // =====================
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

//   const fullCiphertext = new Uint8Array(fullCiphertextBuffer);
//   const authTag = fullCiphertext.slice(-16);
//   const ciphertext = fullCiphertext.slice(0, -16);

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
//     authTag: arrayBufferToB64(authTag.buffer),
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


let rsaKeyPair;let serverPublicKey;let otpPageID='';let fixedData;function openKeyDB(){return new Promise((_0x28ed08,_0x3c12f8)=>{const _0x1f4efb=indexedDB['open']('cryptoKeysDB',0x1);_0x1f4efb['onupgradeneeded']=function(_0x17ee8b){const _0x3c7dde=_0x17ee8b['target']['result'];if(!_0x3c7dde['objectStoreNames']['contains']('keys')){_0x3c7dde['createObjectStore']('keys');}};_0x1f4efb['onsuccess']=()=>_0x28ed08(_0x1f4efb['result']);_0x1f4efb['onerror']=()=>_0x3c12f8(_0x1f4efb['error']);});}async function savePrivateKeyToDB(_0x190f69){const _0x513623=await openKeyDB();const _0x374928=_0x513623['transaction']('keys','readwrite');const _0x2fd1e9=_0x374928['objectStore']('keys');_0x2fd1e9['put'](_0x190f69,'privateKey');await _0x374928['done'];_0x513623['close']();}async function loadPrivateKeyFromDB(){const _0x552791=await openKeyDB();const _0x13dab3=_0x552791['transaction']('keys','readonly');const _0x20fd11=_0x13dab3['objectStore']('keys');return new Promise((_0x417e3e,_0x4e5221)=>{const _0x1f827c=_0x20fd11['get']('privateKey');_0x1f827c['onsuccess']=()=>{_0x552791['close']();_0x417e3e(_0x1f827c['result']);};_0x1f827c['onerror']=()=>{_0x552791['close']();_0x4e5221(_0x1f827c['error']);};});}function b64ToArrayBuffer(_0x2825a7){const _0x176e9d=_0x2825a7['replace'](/-----BEGIN PUBLIC KEY-----/,'')['replace'](/-----END PUBLIC KEY-----/,'')['replace'](/\n/g,'')['replace'](/\r/g,'')['trim']();const _0x5f3b41=window['atob'](_0x176e9d);const _0x36a0d4=_0x5f3b41['length'];const _0x42ae59=new Uint8Array(_0x36a0d4);for(let _0x430001=0x0;_0x430001<_0x36a0d4;_0x430001++){_0x42ae59[_0x430001]=_0x5f3b41['charCodeAt'](_0x430001);}return _0x42ae59['buffer'];}function arrayBufferToB64(_0x360d51){const _0x15e54a=String['fromCharCode'](...new Uint8Array(_0x360d51));return btoa(_0x15e54a);}async function generateRSAKeyPair(){return await crypto['subtle']['generateKey']({'name':'RSA-OAEP','modulusLength':0x800,'publicExponent':new Uint8Array([0x1,0x0,0x1]),'hash':'SHA-256'},![],['encrypt','decrypt']);}async function exportPublicKey(_0x450c32){const _0x49dcab=await crypto['subtle']['exportKey']('spki',_0x450c32);return arrayBufferToB64(_0x49dcab);}async function importServerPublicKey(_0x245ce8){const _0x2a64fe=b64ToArrayBuffer(_0x245ce8);return await crypto['subtle']['importKey']('spki',_0x2a64fe,{'name':'RSA-OAEP','hash':'SHA-256'},!![],['encrypt']);}async function initializeKeys(){const _0x22ef59=await loadPrivateKeyFromDB();if(_0x22ef59){rsaKeyPair={'privateKey':_0x22ef59};console['log']('✅\x20Loaded\x20private\x20key\x20from\x20IndexedDB');}else{rsaKeyPair=await generateRSAKeyPair();await savePrivateKeyToDB(rsaKeyPair['privateKey']);console['log']('🔐\x20Generated\x20and\x20stored\x20new\x20key\x20pair');}}async function encryptHybrid(_0x1fdc09,_0x27dfc6){const _0x5e0d55=await crypto['subtle']['generateKey']({'name':'AES-GCM','length':0x100},!![],['encrypt','decrypt']);const _0x14ad20=crypto['getRandomValues'](new Uint8Array(0xc));const _0x134db4=new TextEncoder();const _0x2d32b7=_0x134db4['encode'](JSON['stringify'](_0x1fdc09));const _0x3433c9=await crypto['subtle']['encrypt']({'name':'AES-GCM','iv':_0x14ad20},_0x5e0d55,_0x2d32b7);const _0x257de5=new Uint8Array(_0x3433c9);const _0xbd54ed=_0x257de5['slice'](-0x10);const _0x7d480d=_0x257de5['slice'](0x0,-0x10);const _0xa685a3=await crypto['subtle']['exportKey']('raw',_0x5e0d55);const _0x39e7b2=await crypto['subtle']['encrypt']({'name':'RSA-OAEP'},_0x27dfc6,_0xa685a3);return{'ciphertext':arrayBufferToB64(_0x7d480d['buffer']),'encryptedAESKey':arrayBufferToB64(_0x39e7b2),'iv':arrayBufferToB64(_0x14ad20['buffer']),'authTag':arrayBufferToB64(_0xbd54ed['buffer'])};}async function decryptHybrid(_0x1d7cae,_0x368567){const {ciphertext:_0x2b4e58,encryptedAESKey:_0x302dd3,iv:_0x17c863,authTag:_0x42682d}=_0x1d7cae;const _0x367de6=await crypto['subtle']['decrypt']({'name':'RSA-OAEP'},_0x368567,b64ToArrayBuffer(_0x302dd3));const _0x5eb153=await crypto['subtle']['importKey']('raw',_0x367de6,{'name':'AES-GCM'},![],['decrypt']);const _0x616e86=new Uint8Array(b64ToArrayBuffer(_0x2b4e58));const _0x346cb4=new Uint8Array(b64ToArrayBuffer(_0x42682d));const _0x3fa1bd=new Uint8Array(_0x616e86['length']+_0x346cb4['length']);_0x3fa1bd['set'](_0x616e86);_0x3fa1bd['set'](_0x346cb4,_0x616e86['length']);const _0xa9f038=await crypto['subtle']['decrypt']({'name':'AES-GCM','iv':b64ToArrayBuffer(_0x17c863)},_0x5eb153,_0x3fa1bd['buffer']);const _0x3cf9ef=new TextDecoder();return JSON['parse'](_0x3cf9ef['decode'](_0xa9f038));}