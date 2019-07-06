// const crypto = require('crypto');
// const algorithm = 'aes-256-cbc';
// const key = crypto.randomBytes(32);
// const iv = crypto.randomBytes(16);

// function encrypt(text) {
//  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
//  let encrypted = cipher.update(text);
//  encrypted = Buffer.concat([encrypted, cipher.final()]);
//  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
// }

// function decrypt(text) {
//  let iv = Buffer.from(text.iv, 'hex');
//  let encryptedText = Buffer.from(text.encryptedData, 'hex');
//  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
//  let decrypted = decipher.update(encryptedText);
//  decrypted = Buffer.concat([decrypted, decipher.final()]);
//  return decrypted.toString();
// }

// // var hw = encrypt('{"name":"mukul","password":"1234"}')
// // console.log(hw)
// // var dw = decrypt(hw)
// // var pw = JSON.parse(dw)
// // console.log(pw,pw.name)
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
 
function encrypt(text) {
    return cryptr.encrypt(text);
}
function decrypt(text) {
    return cryptr.decrypt(text);
}

module.exports = {
    encrypt, decrypt
}