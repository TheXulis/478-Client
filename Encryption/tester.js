const crypto = require('./encryption');
const path = require('path');
const fs = require('fs');

let absoluteKeyPath = path.resolve('./keys/BobPublicKey.pem');
let rsaPublicKey = fs.readFileSync(absoluteKeyPath, 'utf8');

let json = crypto.encrypt("A Message", rsaPublicKey);
    
let plaintext = crypto.decrypt(json);
console.log(plaintext);

// const path = require('path');
// const fs = require('fs');

// let absoluteKeyPath = path.resolve('./keys/publicChatKey.pem');
// let rsaPublicKey = fs.readFileSync(absoluteKeyPath, 'utf8');
// console.log(rsaPublicKey);