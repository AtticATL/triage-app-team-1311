// transfer urls
//   https://something-deeplink-idk/

// secret storage:
//   PRIVATE datastore, explicitly shared through some other channel
//   Secure storage (encrypted with lockscreen auth) on iOS/Android
//   Session storage w/ expiration on web
//   (data hash) -> (key data)
//   () -> (device public key, device private key)

// blob storage:
//   PUBLIC datastore, implicitly shared with anyone who wants it
//   basically just a cache for Firebase Storage
//   (data hash) -> (cyphertext)
//   everything in here

// put(data) -> keyID
//    generate key
//    store (keyID -> key) in key storage
//    store (keyID -> encrypt(data, key)) in blob storage
//    return keyID

// get(keyID) -> data
//    get key from key storage, cyphertext from data storage
//    decrypt cyphertext with key
//    return plaintext
