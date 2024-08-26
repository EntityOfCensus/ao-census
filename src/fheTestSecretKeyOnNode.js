import {
    dryrun,
  } from '@permaweb/aoconnect';
  import dotenv from 'dotenv';
  dotenv.config();
import assert  from 'assert';
  
  const ao_process_id = process.env.FHE_PROCESS_ID
  const ao_process_id2 = process.env.FHE_PROCESS_ID2
  
  const encryptedValue = await encryptIntegerValue(35)
  const d1 = await decryptIntegerValue(encryptedValue)
  const d2 = await decryptIntegerValue2(encryptedValue)
  assert(35 == d1) 
  assert(35 == d2) 
  const encryptedValue2 = await encryptIntegerValue2(81)
  const d3 = await decryptIntegerValue(encryptedValue2)
  const d4 = await decryptIntegerValue2(encryptedValue2)
  assert(81 == d3) 
  assert(81 == d4) 

  async function encryptIntegerValue(value) {
    try {
      console.log('encrypt value', value);
      const txIn = await dryrun({
        process: ao_process_id,
        tags: [
          { name: 'Action', value: 'EncryptIntegerValue' },
          { name: 'Val', value: value + '' },
        ],
      });
      const data = txIn.Messages[0].Data + '';
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return {};
    }
  }

  async function decryptIntegerValue(value) {
    try {
      const txOut = await dryrun({
        process: ao_process_id,
        tags: [
          { name: 'Action', value: 'DecryptIntegerValue' },
          { name: 'Val', value: value },
        ],
      });
    const data = txOut.Messages[0].Data + '';
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }
  
  async function encryptIntegerValue2(value) {
    try {
      console.log('encrypt value', value);
      const txIn = await dryrun({
        process: ao_process_id2,
        tags: [
          { name: 'Action', value: 'EncryptIntegerValue' },
          { name: 'Val', value: value + '' },
        ],
      });
      const data = txIn.Messages[0].Data + '';
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return {};
    }
  }

  async function decryptIntegerValue2(value) {
    try {
      const txOut = await dryrun({
        process: ao_process_id2,
        tags: [
          { name: 'Action', value: 'DecryptIntegerValue' },
          { name: 'Val', value: value },
        ],
      });
        const data = txOut.Messages[0].Data + '';
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

