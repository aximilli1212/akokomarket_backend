const crypto = require('crypto');

/**
 * Generates random salt
 */
exports.generateSalt = function() {
    return crypto.randomBytes(16).toString('base64');
};


exports.encryptPassword = function(password, salt) {

    if (!password || !salt)
        throw new Error('Password and salt required!');

    return crypto.pbkdf2Sync(password, new Buffer(salt, 'base64'), 10000, 64, 'SHA256').toString('base64');
};


exports.comparePassword = function(plainText, hashed, salt) {
    return this.encryptPassword(plainText, salt) === hashed;
};
