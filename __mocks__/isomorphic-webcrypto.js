// Re-export the Node implementation of the Web Crypto API for testing.
// In the actual app, it'll use "isomorphic-webcrypto".
module.exports = require("crypto").webcrypto;
