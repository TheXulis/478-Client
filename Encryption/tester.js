const crypto = require('./encryption');

let json = crypto.encryption("A Message");


let plaintext = crypto.decrypt(json);
console.log(plaintext);