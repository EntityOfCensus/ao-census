import createModule from './eoc-tfhelib.js';

(async () => {
    try {
        console.log("Starting module initialization...");
        const Module = await createModule();
        // console.log("Module loaded:", Module);

        Module.onRuntimeInitialized = () => {
            console.log("Module initialized successfully.");

            // Generate a secret key
            const base64SecretKey = Module.generateSecretKey();
            console.log("Generated Secret Key: OK");//, base64SecretKey);

            // Generate a public key from the secret key
            const base64PublicKey = Module.generatePublicKey(base64SecretKey);
            console.log("Generated Public Key: OK");//, base64PublicKey);

            // Encrypt integers using the secret key
            const valueToEncrypt1 = 7;
            const valueToEncrypt2 = 5;
            const encryptedValue1 = Module.encryptInteger(valueToEncrypt1, base64SecretKey);
            const encryptedValue2 = Module.encryptInteger(valueToEncrypt2, base64SecretKey);
            console.log("Encrypted Value 1: OK");//, encryptedValue1);
            console.log("Encrypted Value 2: OK"); //, encryptedValue2);

            // Encrypt a string using the secret key
            const stringToEncrypt = "Hello, World!";
            const encryptedString = Module.encryptString(stringToEncrypt, base64SecretKey);
            console.log("Encrypted String: OK");//, encryptedString);

            // Perform addition on encrypted values
            const encryptedSum = Module.addCiphertexts(encryptedValue1, encryptedValue2, base64PublicKey);
            console.log("Encrypted Sum: OK");//, encryptedSum);

            // Perform subtraction on encrypted values
            const encryptedDiff = Module.subtractCiphertexts(encryptedValue1, encryptedValue2, base64PublicKey);
            console.log("Encrypted Difference: OK");//, encryptedDiff);

            // Decrypt the results using the secret key
            const decryptedSum = Module.decryptInteger(encryptedSum, base64SecretKey);
            const decryptedDiff = Module.decryptInteger(encryptedDiff, base64SecretKey);
            console.log("Decrypted Sum:", decryptedSum);
            console.log("Decrypted Difference:", decryptedDiff);

            // Decrypt the encrypted string using the secret key
            const decryptedString = Module.decryptString(encryptedString, base64SecretKey, stringToEncrypt.length);
            console.log("Decrypted String:", decryptedString);

            // Verify the decrypted string matches the original
            if (decryptedString === stringToEncrypt) {
                console.log("String encryption and decryption successful.");
            } else {
                console.log("Mismatch in string encryption and decryption.");
            }

            // Verify the decrypted values match the expected results
            if (decryptedSum === (valueToEncrypt1 + valueToEncrypt2)) {
                console.log("Addition successful.");
            } else {
                console.log("Mismatch in addition.");
            }

            if (decryptedDiff === (valueToEncrypt1 - valueToEncrypt2)) {
                console.log("Subtraction successful.");
            } else {
                console.log("Mismatch in subtraction.");
            }
        };

        if (Module.calledRun) {
            Module.onRuntimeInitialized();
        } else {
            console.log("Waiting for runtime initialization...");
        }
    } catch (error) {
        console.error("Error initializing the module:", error);
    }
})();
