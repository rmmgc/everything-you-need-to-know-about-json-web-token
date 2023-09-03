import fs from 'fs';
import crypto from 'crypto';

const KEYS_DIR_PATH = './keys';

function generateKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem'
    }
  });

  return { publicKey, privateKey };
}

const { publicKey, privateKey } = generateKeyPair();

if (!fs.existsSync(KEYS_DIR_PATH)) {
  fs.mkdirSync(KEYS_DIR_PATH)
}

fs.writeFileSync('./keys/private.pem', privateKey);
fs.writeFileSync('./keys/public.pem', publicKey);
