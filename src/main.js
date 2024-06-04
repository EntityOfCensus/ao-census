import {
  dryrun,
  createDataItemSigner,
  message,
  connect,
} from "@permaweb/aoconnect";
import dotenv from "dotenv";
dotenv.config();

const wallet = JSON.parse(process.env.JWK);

const TESTING_CENSUS_PROCESS_ID = "taFQ_bgJhuBLNP7VXMdYq9xq9938oqinxboiLi7k2M8";

addSurvey();
getUserSurveys();

async function getSurveys() {
  try {
    const tx = await dryrun({
      process: "taFQ_bgJhuBLNP7VXMdYq9xq9938oqinxboiLi7k2M8",
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
      process: "taFQ_bgJhuBLNP7VXMdYq9xq9938oqinxboiLi7k2M8",
      tags: [
        { name: "Action", value: "GetSurveyByKv" },
        { name: "Key", value: "ao_id" },
        { name: "Val", value: "Zwc3mlhb_jqSFfQMFhi_dqaLuaHTVxYI_YHx2XVLP8k" },
      ],
    });

    console.log(JSON.parse(tx.Messages[0].Data));

    return JSON.parse(tx.Messages[0].Data);
  } catch (error) {
    console.log(error);
    return {};
  }
}

async function getUserSurveys() {
  try {
    const tx = await dryrun({
      process: "taFQ_bgJhuBLNP7VXMdYq9xq9938oqinxboiLi7k2M8",
      tags: [
        { name: "Action", value: "GetUserSurveyIds" },
        {
          name: "UserAddress",
          value: "GZ9C-1wQUbq-C1V9meyRBkFsoiNXlCS1gETxSL0P3LY",
        },
      ],
    });

    console.log(JSON.parse(tx.Messages[0].Data));

    return JSON.parse(tx.Messages[0].Data);
  } catch (error) {
    console.log(error);
    return {};
  }
}

async function addSurvey() {
  try {
    const messageId = await message({
      process: "taFQ_bgJhuBLNP7VXMdYq9xq9938oqinxboiLi7k2M8",
      signer: createDataItemSigner(wallet),
      // the survey as stringified JSON
      data: '{"type":"survey","config":"easy","countryCodes":["US","DZ","UA","RO"],"countryNames":["United States of America","Algeria","Ukraine","Romania"],"wantedRespondents":1000,"wantedQuestions":50,"targetGroups":[{"minimumAge":18,"maximumAge":64,"gender":"both","country":"United States of America","wantedCompletes":"753","ir":"100","loi":"17","daysInField":"7","startDate":"2024-05-16T13:54:48.029Z","time":"00:00","visible":true},{"minimumAge":18,"maximumAge":64,"gender":"both","country":"Algeria","wantedCompletes":"102","ir":"100","loi":"17","daysInField":"7","startDate":"2024-05-16T13:54:48.029Z","time":"00:00","visible":true},{"minimumAge":18,"maximumAge":64,"gender":"both","country":"Ukraine","wantedCompletes":"101","ir":"100","loi":"17","daysInField":"7","startDate":"2024-05-16T13:54:48.029Z","time":"00:00","visible":true},{"minimumAge":18,"maximumAge":64,"gender":"both","country":"Romania","wantedCompletes":"44","ir":"100","loi":"17","daysInField":"7","startDate":"2024-05-16T13:54:48.029Z","time":"00:00","visible":true}]}',
      tags: [{ name: "Action", value: "AddSurvey" }],
    });

    console.log(messageId);
    return { messageId };
  } catch (error) {
    console.log(error);
    return { messageId: false };
  }
}
