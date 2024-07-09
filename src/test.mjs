import createModule from './eoc-tfhelib.js';

(async () => {
    try {
        console.log("Starting module initialization...");
        const Module = await createModule();
        // console.log("Module loaded:", Module);

        Module.onRuntimeInitialized = () => {
            console.log("Module initialized successfully.");

             // Generate a key
             const base64Key = Module.generateKey();
            //  console.log("Generated Key:", base64Key);
 
             // Encrypt an integer
             const valueToEncrypt = 7;
             const encryptedValue = Module.encryptInteger(valueToEncrypt, base64Key);
             console.log("Encrypted Value:", encryptedValue);
 
             // Decrypt the encrypted integer
             const decryptedValue = Module.decryptInteger(encryptedValue, base64Key);
             console.log("Decrypted Value:", decryptedValue);
 
             // Verify the decrypted value matches the original
             if (decryptedValue === valueToEncrypt) {
                 console.log("Encryption and decryption successful.");
             } else {
                 console.log("Mismatch in encryption and decryption.");
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
