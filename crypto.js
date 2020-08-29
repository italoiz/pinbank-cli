const crypto = require('crypto');

class Crypto {
  constructor({ credentials }) {
    this.credentials = credentials;
  }

  /**
   * IV (Vector Initialization) to encrypt and descrypt.
   */
  get iv() {
    return Buffer.alloc(16);
  }

  /**
   * The secret key.
   */
  get secret() {
    return Buffer.from(this.credentials.keyValue, 'utf8');
  }

  /**
   * Encrypt Method.
   *
   * Cipher any content and return payload encrypted with base64 encoding.
   */
  encrypt(content) {
    const plainText =
      typeof content === 'string' ? content : JSON.stringify(content);

    const cipher = crypto.createCipheriv('aes-128-cbc', this.secret, this.iv);

    return Buffer.concat([
      cipher.update(plainText, 'utf8'),
      cipher.final(),
    ]).toString('base64');
  }

  /**
   * Decrypt Method.
   *
   * Decipher any content from responses with a secret key.
   */
  decrypt(payload) {
    const decipher = crypto.createDecipheriv('aes-128-cbc', this.secret, this.iv);

    const decoded = Buffer.concat([
      decipher.update(payload, 'base64'),
      decipher.final(),
    ]).toString('utf8');

    return JSON.parse(decoded) || undefined;
  }
}

module.exports = Crypto;
