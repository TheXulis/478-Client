const crypto = require('./encryption');
const PythonShell = require('python-shell');

var options = {
    mode: 'text'
};

PythonShell.run('Encryption/keygen.py', function(err, results){
    console.log(results)
    let json = crypto.encryption("A Message");
    
    let plaintext = crypto.decrypt(json);
    console.log(plaintext);
})

// let json = crypto.encryption("A Message");
    
// let plaintext = crypto.decrypt(json);
// console.log(plaintext);