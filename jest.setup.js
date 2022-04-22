// Polyfill the TextEncoder global;
window.TextEncoder = require("util").TextEncoder;
window.TextDecoder = require("util").TextDecoder;

// Polyfill crypto.getRandomValues
window.crypto = require("crypto").webcrypto;

// Mock IndexedDB
require("fake-indexeddb/auto");
