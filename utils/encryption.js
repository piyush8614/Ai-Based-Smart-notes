import CryptoJS from "crypto-js";

// 🔐 Encrypt
export function encryptText(text, key) {
  const encrypted = CryptoJS.AES.encrypt(text, key).toString();
  return encrypted;
}

// 🔓 Decrypt
export function decryptText(cipherText, key) {

  try {

    const bytes = CryptoJS.AES.decrypt(cipherText, key);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);

    if (!decrypted) {
      throw new Error("Wrong key");
    }

    return decrypted;

  } catch (error) {
    throw new Error("Invalid key or corrupted data");
  }
}