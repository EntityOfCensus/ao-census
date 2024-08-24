import createModule from './eoc-tfhelib.js';

(async () => {
  try {
    console.log('Starting module initialization...');
    const Module = await createModule();

    Module.onRuntimeInitialized = () => {
      console.log('Module initialized successfully.');

      // Generate a secret key
      const base64SecretKey = Module.generateSecretKey();
      console.log('Generated Secret Key: OK'); //, base64SecretKey);

      // Generate a public key using the secret key
      const base64PublicKey = Module.generatePublicKey(base64SecretKey);
      console.log('Generated Public Key: OK'); //, base64PublicKey);

      // Encrypt an integer using the global secret key
      const valueToEncrypt = 7;
      const encryptedValue = Module.encryptInteger(valueToEncrypt);
      console.log('Encrypted Value: OK'); //, encryptedValue);

      // Decrypt the encrypted integer using the global secret key
      const decryptedValue = Module.decryptInteger(encryptedValue);
      console.log('Decrypted Value: ', decryptedValue);

      // Verify the decrypted value matches the original
      if (decryptedValue === valueToEncrypt) {
        console.log('Encryption and decryption successful.');
      } else {
        console.log('Mismatch in encryption and decryption.');
      }

      // Encrypt another integer
      const valueToEncrypt2 = 3;
      const encryptedValue2 = Module.encryptInteger(valueToEncrypt2);
      console.log('Encrypted Value 2: OK'); //, encryptedValue2);

      // Add the encrypted integers using the global public key
      const encryptedSum = Module.addCiphertexts(
        encryptedValue,
        encryptedValue2,
      );
      console.log('Encrypted Sum: OK'); //, encryptedSum);

      // Decrypt the encrypted sum using the global secret key
      const decryptedSum = Module.decryptInteger(encryptedSum);
      console.log('Decrypted Sum:', decryptedSum);

      // Subtract the encrypted integers using the global public key
      const encryptedDiff = Module.subtractCiphertexts(
        encryptedValue,
        encryptedValue2,
      );
      console.log('Encrypted Difference: OK'); //, encryptedDiff);

      // Decrypt the encrypted difference using the global secret key
      const decryptedDiff = Module.decryptInteger(encryptedDiff);
      console.log('Decrypted Difference:', decryptedDiff);
    };

    if (Module.calledRun) {
      Module.onRuntimeInitialized();
    } else {
      console.log('Waiting for runtime initialization...');
    }
  } catch (error) {
    console.error('Error initializing the module:', error);
  }
})();
