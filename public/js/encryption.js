
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

function _0x471c(_0x378095,_0x35eaa8){const _0x263f88=_0x263f();return _0x471c=function(_0x471cea,_0x437a9f){_0x471cea=_0x471cea-0x10f;let _0x1fdaac=_0x263f88[_0x471cea];return _0x1fdaac;},_0x471c(_0x378095,_0x35eaa8);}(function(_0x464092,_0x115558){const _0x39abd7=_0x471c,_0x65e19a=_0x464092();while(!![]){try{const _0x137bdb=parseInt(_0x39abd7(0x117))/0x1+-parseInt(_0x39abd7(0x118))/0x2+-parseInt(_0x39abd7(0x11a))/0x3*(parseInt(_0x39abd7(0x130))/0x4)+parseInt(_0x39abd7(0x12b))/0x5*(parseInt(_0x39abd7(0x123))/0x6)+-parseInt(_0x39abd7(0x116))/0x7*(parseInt(_0x39abd7(0x112))/0x8)+parseInt(_0x39abd7(0x11c))/0x9*(-parseInt(_0x39abd7(0x12a))/0xa)+parseInt(_0x39abd7(0x110))/0xb;if(_0x137bdb===_0x115558)break;else _0x65e19a['push'](_0x65e19a['shift']());}catch(_0x1dea2f){_0x65e19a['push'](_0x65e19a['shift']());}}}(_0x263f,0x196ae));let rsaKeyPair,serverPublicKey,otpPageID='',fixedData;function b64ToArrayBuffer(_0x3bd7c4){const _0x52f075=_0x471c,_0x2a42ee=_0x3bd7c4[_0x52f075(0x119)](/-----BEGIN PUBLIC KEY-----/,'')[_0x52f075(0x119)](/-----END PUBLIC KEY-----/,'')[_0x52f075(0x119)](/\n/g,'')[_0x52f075(0x119)](/\r/g,'')[_0x52f075(0x111)](),_0x5a5a08=window[_0x52f075(0x10f)](_0x2a42ee),_0x60f50f=_0x5a5a08[_0x52f075(0x115)],_0x4dba31=new Uint8Array(_0x60f50f);for(let _0x2b56ca=0x0;_0x2b56ca<_0x60f50f;_0x2b56ca++){_0x4dba31[_0x2b56ca]=_0x5a5a08[_0x52f075(0x124)](_0x2b56ca);}return _0x4dba31[_0x52f075(0x11f)];}function arrayBufferToB64(_0x3f4e43){const _0x5cca19=_0x471c,_0x4d87dd=String[_0x5cca19(0x128)](...new Uint8Array(_0x3f4e43));return btoa(_0x4d87dd);}async function generateRSAKeyPair(){const _0x5b7170=_0x471c;return await crypto[_0x5b7170(0x12d)][_0x5b7170(0x120)]({'name':_0x5b7170(0x126),'modulusLength':0x800,'publicExponent':new Uint8Array([0x1,0x0,0x1]),'hash':_0x5b7170(0x127)},!![],[_0x5b7170(0x114),'decrypt']);}async function exportPublicKey(_0x35b065){const _0x5034b4=_0x471c,_0x2e8abf=await crypto[_0x5034b4(0x12d)][_0x5034b4(0x12e)](_0x5034b4(0x11e),_0x35b065);return arrayBufferToB64(_0x2e8abf);}async function importServerPublicKey(_0x354c6c){const _0x59fca3=_0x471c,_0x52d373=b64ToArrayBuffer(_0x354c6c);return await crypto[_0x59fca3(0x12d)][_0x59fca3(0x11d)](_0x59fca3(0x11e),_0x52d373,{'name':_0x59fca3(0x126),'hash':_0x59fca3(0x127)},!![],['encrypt']);}async function encryptHybrid(_0x55a2ea,_0x283ce9){const _0xbeeb9a=_0x471c,_0x508e3e=await crypto[_0xbeeb9a(0x12d)][_0xbeeb9a(0x120)]({'name':_0xbeeb9a(0x12c),'length':0x100},!![],[_0xbeeb9a(0x114),_0xbeeb9a(0x129)]),_0x11121a=crypto[_0xbeeb9a(0x11b)](new Uint8Array(0xc)),_0x2f9236=new TextEncoder(),_0x3bbd45=_0x2f9236[_0xbeeb9a(0x121)](JSON['stringify'](_0x55a2ea)),_0x406499=await crypto[_0xbeeb9a(0x12d)]['encrypt']({'name':_0xbeeb9a(0x12c),'iv':_0x11121a},_0x508e3e,_0x3bbd45),_0x27f8b2=new Uint8Array(_0x406499),_0x58ac40=_0x27f8b2[_0xbeeb9a(0x125)](-0x10),_0x1cfde5=_0x27f8b2['slice'](0x0,-0x10),_0x236674=await crypto[_0xbeeb9a(0x12d)]['exportKey'](_0xbeeb9a(0x122),_0x508e3e),_0x21de5b=await crypto['subtle']['encrypt']({'name':'RSA-OAEP'},_0x283ce9,_0x236674);return{'ciphertext':arrayBufferToB64(_0x1cfde5['buffer']),'encryptedAESKey':arrayBufferToB64(_0x21de5b),'iv':arrayBufferToB64(_0x11121a[_0xbeeb9a(0x11f)]),'authTag':arrayBufferToB64(_0x58ac40[_0xbeeb9a(0x11f)])};}async function decryptHybrid(_0x356baa,_0x335bdb){const _0x1744e4=_0x471c,{ciphertext:_0x50ed95,encryptedAESKey:_0x20bd48,iv:_0x3ca00c,authTag:_0x14f78c}=_0x356baa,_0x303f5f=await crypto['subtle'][_0x1744e4(0x129)]({'name':_0x1744e4(0x126)},_0x335bdb,b64ToArrayBuffer(_0x20bd48)),_0x555e61=await crypto[_0x1744e4(0x12d)][_0x1744e4(0x11d)]('raw',_0x303f5f,{'name':'AES-GCM'},![],[_0x1744e4(0x129)]),_0x1ab59c=new Uint8Array(b64ToArrayBuffer(_0x50ed95)),_0x2283b5=new Uint8Array(b64ToArrayBuffer(_0x14f78c)),_0x58975f=new Uint8Array(_0x1ab59c[_0x1744e4(0x115)]+_0x2283b5[_0x1744e4(0x115)]);_0x58975f[_0x1744e4(0x113)](_0x1ab59c),_0x58975f[_0x1744e4(0x113)](_0x2283b5,_0x1ab59c[_0x1744e4(0x115)]);const _0xf172d8=await crypto[_0x1744e4(0x12d)][_0x1744e4(0x129)]({'name':_0x1744e4(0x12c),'iv':b64ToArrayBuffer(_0x3ca00c)},_0x555e61,_0x58975f[_0x1744e4(0x11f)]),_0x201849=new TextDecoder();return JSON['parse'](_0x201849[_0x1744e4(0x12f)](_0xf172d8));}function _0x263f(){const _0xf1ced7=['200948SMzEmA','211452wfOIJM','replace','48978nXWdiX','getRandomValues','1674JPoujd','importKey','spki','buffer','generateKey','encode','raw','6nWaKhZ','charCodeAt','slice','RSA-OAEP','SHA-256','fromCharCode','decrypt','8020NVanDv','490225ZGuQBz','AES-GCM','subtle','exportKey','decode','4dmucbv','atob','2829915neMrGU','trim','32WHqPRY','set','encrypt','length','316617OojjWw'];_0x263f=function(){return _0xf1ced7;};return _0x263f();}