import {
    dryrun,
} from '@permaweb/aoconnect';
import dotenv from 'dotenv';
dotenv.config();
import assert from 'assert';

// This code is a test example demonstrating how to consume encryption operations
// over an AO process with the npm dryrun function from @permaweb/aoconnect.
// It sends values in ao msg.Tags without leaving any trace of the values in the messages.

const ao_process_id = process.env.FHE_PROCESS_ID;

const encryptedValue = await encryptIntegerValue(35);
const d1 = await decryptIntegerValue(encryptedValue);
assert(35 == d1);

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
