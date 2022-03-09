// Polyfill the Web Crypto API
// @ts-ignore
window.crypto = require("crypto").webcrypto;
