import {
    dryrun,
    createDataItemSigner,
    message,
    connect,
  } from "@permaweb/aoconnect";
  import dotenv from "dotenv";
  dotenv.config();
  
  
  const wallet = JSON.parse(process.env.JWK);
  
 await storeEncryptedData(await encryptIntegerValue(57)) 
// await getEncryption()
// await runAddOnEncryptedData()
// await runAddOnEncryptedData(await storeEncryptedData(await encryptIntegerValue(57)), await storeEncryptedData(await encryptIntegerValue(27)));


 async function getEncryption() {
    try {
      const tx = await dryrun({
        process: "hDqk7GM9m429UI7KvbXKdFfsEvyw5Tx4otcbLAAh9sg",
        tags: [{ name: "Action", value: "GetEncryption" }],
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
      const txIn = await dryrun({
        process: "ugWbo0POFXQlGYtcWauGHpGYi7mpjhV7wjbqBmXgZg4",
        tags: [
          { name: "Action", value: "EncryptIntegerValue" },
          { name: "Val", value: value + "" },
        ],
      });
      const data = txIn.Messages[0].Data + "";
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
        process: "ugWbo0POFXQlGYtcWauGHpGYi7mpjhV7wjbqBmXgZg4",
        signer: createDataItemSigner(wallet),
        // the survey as stringified JSON
        data: '{"type": "integer", "value":"' + value + '"}',
        tags: [{ name: "Action", value: "StoreEncryptedData" }],
      });
  
      console.log(messageId);

      const txIn = await dryrun({
        process: "ugWbo0POFXQlGYtcWauGHpGYi7mpjhV7wjbqBmXgZg4",
        tags: [
          { name: "Action", value: "GetDataByKv" },
          { name: "Key", value: "ao_id" },
          { name: "Val", value: messageId + "" },
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

    const txOut = await dryrun({
        process: "ugWbo0POFXQlGYtcWauGHpGYi7mpjhV7wjbqBmXgZg4",
        tags: [
        { name: "Action", value: "DecryptIntegerValue" },
        { name: "Val", value: data.value },
        ],
    });
    const result = txOut.Messages[0].Data + "";
    console.log(result);
      return messageId;
    } catch (error) {
      console.log(error);
      return { messageId: false };
    }
  }

 async function runAddOnEncryptedData(ao_id_val_left, ao_id_val_right) {
    try {
        // const messageId = await message({
        //   process: "hDqk7GM9m429UI7KvbXKdFfsEvyw5Tx4otcbLAAh9sg",
        //   signer: createDataItemSigner(wallet),
        //   // the survey as stringified JSON
        //   data: '{"operation": "add", "ao_id_val_left":' + ao_id_val_left + ', "ao_id_val_right":'+ ao_id_val_right + '}',
        //   tags: [{ name: "Action", value: "StoreComputeOperationOnEncryptedData" }],
        // });
    
        // console.log(messageId);
        const txIn = await dryrun({
            process: "hDqk7GM9m429UI7KvbXKdFfsEvyw5Tx4otcbLAAh9sg",
            tags: [
              { name: "Action", value: "GetDataByKv" },
              { name: "Key", value: "ao_id" },
              { name: "Val", value: "gZkS6xzg7g_s6zrbYyQVSGy1w7Kwxc1ObLvPAibBejM" },
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

        const txOut = await dryrun({
            process: "hDqk7GM9m429UI7KvbXKdFfsEvyw5Tx4otcbLAAh9sg",
            tags: [
            { name: "Action", value: "DecryptIntegerValue" },
            { name: "Val", value: data.value },
            ],
        });
        const result = txOut.Messages[0].Data + "";
        console.log(result);

        return  txIn.Messages[0].Data;
      } catch (error) {
        console.log(error);
        return { messageId: false };
      }

 }