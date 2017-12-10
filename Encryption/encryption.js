const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

function encryption(plaintext){
    let AES_IV = crypto.randomBytes(16);

    //AES key generation
    let AESkey = crypto.randomBytes(256);
    let m = crypto.createHash('sha256');
    m.update(AESkey);
    AESkey = m.digest();

    //AES encryption
    let aesBuffer = new Buffer(AESkey, 'binary');
    let AEScipher = crypto.createCipheriv('aes-256-cbc', aesBuffer, AES_IV);
    let aesCiphertext = AEScipher.update(plaintext);
    aesCiphertext = Buffer.concat([aesCiphertext, AEScipher.final()]);
    
    //HMAC key generation
    let hmacKey = crypto.randomBytes(256);
    let m2 = crypto.createHash('sha256');
    m2.update(hmacKey);
    hmacKey = m2.digest();

    //HMAC tag generation
    let hmacBuffer = new Buffer(hmacKey, 'binary');
    let hmac = crypto.createHmac('sha256', hmacBuffer);
    hmac.update(aesCiphertext);
    let hmacTag = hmac.digest('hex');

    //Get RSA Key
    let absoluteKeyPath = path.resolve('./keys/publicChatKey.pem');
    let rsaPublicKey = fs.readFileSync(absoluteKeyPath, 'utf8');
    let rsaBufferKey = new Buffer(rsaPublicKey, 'binary');

    //RSA Key Encryption
    let rsaOptions = {key:rsaPublicKey, padding:crypto.constants.RSA_PKCS1_OAEP_PADDING};
    let rsaBuffer = Buffer.concat([hmacBuffer, aesBuffer]);
    let rsaCiphertext = crypto.publicEncrypt(rsaOptions, rsaBuffer);

    let output = {"rsaCiphertext":rsaCiphertext,
                "aesCiphertext":aesCiphertext,
                "AES_IV": AES_IV,
                "hmacTag": hmacTag};

    console.log(output);
    return output;
}

function decrypt(json) {
    let plaintext = "";
    //Extract everything from the JSON
    let rsaCiphertext = json.rsaCiphertext;
    let aesCiphertext = json.aesCiphertext;
    let AES_IV = json.AES_IV;
    let hmacTag = json.hmacTag;

    //Get RSA Key
    let absoluteKeyPath = path.resolve('./keys/privateChatKey.pem');
    let rsaPrivateKey = fs.readFileSync(absoluteKeyPath, 'utf8');
    let rsaBufferKey = new Buffer(rsaPrivateKey, 'binary');

    //Decrypt RSA
    let options = {key:rsaBufferKey, padding:crypto.constants.RSA_PKCS1_OEAP_PADDING};
    let rsaPlaintext = crypto.privateDecrypt(options, rsaCiphertext);
    let keyLength = Buffer.byteLength(rsaPlaintext, 'hex')/2;

    //Retrieve HMAC key
    let hmacKey = Buffer.alloc(keyLength, 'hex');
    rsaPlaintext.copy(hmacKey, 0, 0, keyLength); 

    //Retrieve AES key
    let aesKey = Buffer.alloc(keyLength, 'hex');
    rsaPlaintext.copy(aesKey, 0, keyLength, keyLength*2);

    //HMAC tag verification
    let hmac = crypto.createHmac('sha256', hmacKey);
    hmac.update(aesCiphertext);
    let hmacTag2 = hmac.digest('hex');
    if(hmacTag2==(hmacTag2)){
        //AES decryption
        let decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, AES_IV);
        let aesPlaintext = decipher.update(aesCiphertext);
        aesPlaintext = Buffer.concat([aesPlaintext, decipher.final()]);
        plaintext = aesPlaintext.toString();
    }
    else{
        console.log('Error Decrypting');
    }

    return plaintext;
}

module.exports = {decrypt, encryption};