import {
    dryrun,
    createDataItemSigner,
    message,
  } from '@permaweb/aoconnect';
import dotenv from 'dotenv';
import assert from 'assert';
import crypto from 'crypto';

dotenv.config();

const wallet = JSON.parse(process.env.JWK);
const ao_process_id = process.env.FHE_PROCESS_ID

const id_token = process.env.ID_TOKEN;

async function registerToken(id_token) {
    try {
        const messageId = await message({
            process: ao_process_id,
            signer: createDataItemSigner(wallet),
            // the survey as stringified JSON
            data: '{"id_token:"' + id_token + '"}',
            tags: [{ name: 'Action', value: 'RegisterToken' }],
        });
        console.log(messageId);
        return messageId;
        } catch (error) {
        }
        return null;
}
  
async function encryptIntegerValue(value) {
    try {
      console.log('encrypt value', value);
      const txIn = await dryrun({
        process: ao_process_id,
        data: value + "",
        tags: [
          { name: 'Action', value: 'EncryptIntegerValue' },
        ],
      });
      const data = txIn.Messages[0].Data + '';
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return "";
    }
  }

  async function decryptIntegerValue(value, id_token) {
    try {
      console.log('decrypt value', value);
      const txIn = await dryrun({
        process: ao_process_id,
        data: value + "",
        tags: [
          { name: 'Action', value: 'DecryptIntegerValue' },
          { name: 'id_token', value: id_token },
        ],
      });
      const data = txIn.Messages[0].Data + '';
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return "";
    }
  }

  async function computeOperationOnEncryptedData(val_left, val_right) {
    try {
      const txAddOperation = await dryrun({
        process: ao_process_id,
        data: JSON.stringify({param_value_left: val_left, param_value_right: val_right}),
        tags: [
          { name: 'Action', value: 'ComputeOperationOnEncryptedData' },
          { name: 'operation', value: 'add' },
        ],
      });
      const data = txIn.Messages[0].Data + '';
      console.log(data);
      return data;
    } catch (error) {
      return "";
    }
  }
  
  
// Generate a random number between 0 and 2^16 - 1 (65535)
function getRandomNumber16Bit() {
    // Generate 2 random bytes (16 bits)
    const randomBuffer = crypto.randomBytes(2);
  
    // Convert to a number by interpreting the bytes as a 16-bit integer
    const randomNumber = randomBuffer.readUInt16BE(0);
  
    return randomNumber;
  }
  

  (async () => {
    const val_left = getRandomNumber16Bit();
    const val_right = getRandomNumber16Bit();
    const registerToken = await registerToken(id_token);
    
    const encryptedSum = await computeOperationOnEncryptedData(
        await encryptIntegerValue(val_left), 
        await encryptIntegerValue(val_right)
    );

    const decryptedSum = await decryptIntegerValue(encryptedSum, id_token);
    
    console.log(`Decrypted sum: ${decryptedSum}`);
})();

