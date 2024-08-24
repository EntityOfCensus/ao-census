import {
  dryrun,
  createDataItemSigner,
  message,
  connect,
} from "@permaweb/aoconnect";
import dotenv from "dotenv";
dotenv.config();

// Import the generated JavaScript glue code
// const tfhe_module = require('./eoc-tfhelib.js');
// let key = tfhe_module.generateKey();
// console.log(key);
// import {_generateKey} from './eoc-tfhelib.js';
// let val = _generateKey();
// console.log(val);

const wallet = JSON.parse(process.env.JWK);

// const TESTING_CENSUS_PROCESS_ID = "ENnyYpVeZlS0j01ss-Rht9rHVpmZ73vItDb2Xtrtikc";

getSurveys();
// addSurvey();

async function getSurveys() {
  try {
    const tx = await dryrun({
      process: "ENnyYpVeZlS0j01ss-Rht9rHVpmZ73vItDb2Xtrtikc",
      tags: [{ name: "Action", value: "GetSurveys" }],
    });

    console.log(tx.Messages[0].Data);

    return JSON.parse(tx.Messages[0].Data);
  } catch (error) {
    console.log(error);
    return {};
  }
}

async function getSurveyByKv() {
  try {
    const tx = await dryrun({
      process: "Hhj_asqYC1G_j_4PClxm6SOpzgjnnQbHLuBwOG2wSWg",
      tags: [
        { name: "Action", value: "GetSurveyByKv" },
        { name: "Key", value: "ao_id" },
        { name: "Val", value: "Ou2q9Xwwka_fJ4cuQkavg9pgAZG88n64xOeiBghft5w" } //"Zwc3mlhb_jqSFfQMFhi_dqaLuaHTVxYI_YHx2XVLP8k" },
      ],
    });

    console.log(JSON.parse(tx.Messages[0].Data));

    return JSON.parse(tx.Messages[0].Data);
  } catch (error) {
    console.log(error);
    return {};
  }
}

// async function getUserSurveys() {
//   try {
//     const tx = await dryrun({
//       process: "ENnyYpVeZlS0j01ss-Rht9rHVpmZ73vItDb2Xtrtikc",
//       tags: [
//         { name: "Action", value: "GetUserSurveyIds" },
//         {
//           name: "UserAddress",
//           value: "GZ9C-1wQUbq-C1V9meyRBkFsoiNXlCS1gETxSL0P3LY",
//         },
//       ],
//     });

//     console.log(JSON.parse(tx.Messages[0].Data));

//     return JSON.parse(tx.Messages[0].Data);
//   } catch (error) {
//     console.log(error);
//     return {};
//   }
// }

async function addSurvey() {
  try {
    const messageId = await message({
      process: "Hhj_asqYC1G_j_4PClxm6SOpzgjnnQbHLuBwOG2wSWg",
      signer: createDataItemSigner(wallet),
      // the survey as stringified JSON
      data: '{"type":"respondent-survey","config":"easy","countryCodes":[],"countryNames":[],"wantedRespondents":1,"wantedQuestions":4,"targetGroups":[{"minimumAge":0,"maximumAge":0,"gender":"male","country":"Germany","wantedCompletes":"1","ir":"","loi":"","daysInField":"","startDate":"1983-08-17T00:00:00.000Z","time":"2024-06-04T14:15:10.846Z","visible":true}]}',
      tags: [{ name: "Action", value: "AddSurvey" }],
    });

    console.log(messageId);
    return { messageId };
  } catch (error) {
    console.log(error);
    return { messageId: false };
  }
}
