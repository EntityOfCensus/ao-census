import {
  dryrun,
  createDataItemSigner,
  message,
  connect,
} from '@permaweb/aoconnect';
import dotenv from 'dotenv';
dotenv.config();
import crypto from 'crypto';

const wallet = JSON.parse(process.env.JWK);

await runAddOnEncryptedData(
  await storeEncryptedData(await encryptIntegerValue(getRandomNumber16Bit())),
  await storeEncryptedData(await encryptIntegerValue(getRandomNumber16Bit())),
);
await getEncryption();

// Generate a random number between 0 and 2^16 - 1 (65535)
function getRandomNumber16Bit() {
  // Generate 2 random bytes (16 bits)
  const randomBuffer = crypto.randomBytes(2);

  // Convert to a number by interpreting the bytes as a 16-bit integer
  const randomNumber = randomBuffer.readUInt16BE(0);

  return randomNumber;
}

async function getEncryption() {
  try {
    const tx = await dryrun({
      process: 'pnF9LT39ucFwOyuOjYjEptr-vG5QYxeKc84Y1ZJ8xq0',
      tags: [{ name: 'Action', value: 'GetEncryption' }],
    });

    console.log(tx.Messages[0].Data);

    return JSON.parse(tx.Messages[0].Data);
  } catch (error) {
    console.log(error);
    return {};
  }
}

async function encryptIntegerValue(value) {
  try {
    console.log('encrypt value', value);
    const txIn = await dryrun({
      process: 'pnF9LT39ucFwOyuOjYjEptr-vG5QYxeKc84Y1ZJ8xq0',
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

async function storeEncryptedData(value) {
  try {
    const messageId = await message({
      process: 'pnF9LT39ucFwOyuOjYjEptr-vG5QYxeKc84Y1ZJ8xq0',
      signer: createDataItemSigner(wallet),
      // the survey as stringified JSON
      data: '{"type": "integer", "value":"' + value + '"}',
      tags: [{ name: 'Action', value: 'StoreEncryptedData' }],
    });

    console.log(messageId);

    const data = await getEncryptedData(messageId);

    const txOut = await dryrun({
      process: 'pnF9LT39ucFwOyuOjYjEptr-vG5QYxeKc84Y1ZJ8xq0',
      tags: [
        { name: 'Action', value: 'DecryptIntegerValue' },
        { name: 'Val', value: data.value },
      ],
    });
    const result = txOut.Messages[0].Data + '';
    console.log(result);
    return messageId;
  } catch (error) {
    console.log(error);
    return { messageId: false };
  }
}

async function getEncryptedData(messageId) {
  const txIn = await dryrun({
    process: 'pnF9LT39ucFwOyuOjYjEptr-vG5QYxeKc84Y1ZJ8xq0',
    tags: [
      { name: 'Action', value: 'GetDataByKv' },
      { name: 'Key', value: 'ao_id' },
      { name: 'Val', value: messageId + '' },
    ],
  });

  const encryption = JSON.parse(txIn.Messages[0].Data);

  // Extract the data string
  let dataString = encryption.data;

  // Correct the JSON format by adding quotes around the value
  dataString = dataString.replace(/"value":([^"]+)}/, '"value":"$1"}');

  // Parse the corrected JSON string
  const data = JSON.parse(dataString);

  console.log(data);
  return data;
}

async function runAddOnEncryptedData(ao_id_val_left, ao_id_val_right) {
  try {
    const txAddOperation = await dryrun({
      process: 'pnF9LT39ucFwOyuOjYjEptr-vG5QYxeKc84Y1ZJ8xq0',
      tags: [
        { name: 'Action', value: 'ComputeOperationOnEncryptedData' },
        { name: 'operation', value: 'add' },
        { name: 'ao_id_val_left', value: ao_id_val_left },
        { name: 'ao_id_val_right', value: ao_id_val_right },
      ],
    });
    // const data = txAddOperation.Messages[0].Data + '';
    const messageId = await storeEncryptedData(txAddOperation.Messages[0].Data);
    // console.log(messageId);
    // const dataAo = await getEncryptedData(messageId);
    // const txOut = await dryrun({
    //   process: 'pnF9LT39ucFwOyuOjYjEptr-vG5QYxeKc84Y1ZJ8xq0',
    //   tags: [
    //     { name: 'Action', value: 'DecryptIntegerValue' },
    //     { name: 'Val', value: dataAo.value },
    //   ],
    // });
    // const result = txOut.Messages[0].Data + '';
    // console.log(result);

    return messageId;
  } catch (error) {
    console.log(error);
    return { messageId: false };
  }
}
