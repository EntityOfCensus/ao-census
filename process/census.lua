--[[
    Imports
]] --

local json = require("json")
local ao = require("ao")

--[[
  This module implements the Census Surveys Protocol on ao

  Terms:
    Sender: the wallet or Process that sent the Message

  It will first initialize the internal state, define utils code blocks and then attach handlers.

    - Info(): return process metadata: Name, UsersCount, and SurveysCount.

    - GetSurveys(): getter -- return the table of all surveys.

    - GetUsers(): getter -- return the table of all users.

    - GetSurveyByKv(Key: String, Val: String): getter -- return a survey via KV inputs.

    - GetUserSurveyIds(UserAddress: String): getter -- return surveys issued by the given address.

    - AddSurvey(Data: string): if the Sender provide a format-correct survey instance, it will add it to the
    Surveys table. It will also issue a Survey-Added back to the Sender

]]
--

--[[
  internal state
]]
--
Surveys = Surveys or {}
Users = Users or {}
Name = Name or "Census Surveys"

--[[
  utils helper functions
]]
--

-- The survey template
local template = {
    type = "string",
    config = "string",
    countryCodes = "table",
    countryNames = "table",
    wantedRespondents = "number",
    wantedQuestions = "number",
    targetGroups = {
        {
            minimumAge = "number",
            maximumAge = "number",
            gender = "string",
            country = "string",
            wantedCompletes = "string",
            ir = "string",
            loi = "string",
            daysInField = "string",
            startDate = "string",
            time = "string",
            visible = "boolean"
        }
    }
}

-- Function to check the type of each key in the object
local function checkType(value, expectedType)
    if expectedType == "table" then
        return type(value) == "table"
    else
        return type(value) == expectedType
    end
end

-- Function to validate an object against the survey template
local function validateInstance(instance, tmpl)
    for key, expectedType in pairs(tmpl) do
        local value = instance[key]
        if type(expectedType) == "table" then
            if type(value) ~= "table" then
                return false, key .. " is not a table"
            end
            for i, v in ipairs(value) do
                local valid, err = validateInstance(v, expectedType[1])
                if not valid then
                    return false, key .. "[" .. i .. "]: " .. err
                end
            end
        else
            if not checkType(value, expectedType) then
                return false, key .. " is not of type " .. expectedType
            end
        end
    end
    return true
end

-- Function that returns users count from the associative table Users
local function users_count()
    local count = 0
    for _ in pairs(Users) do
        count = count + 1
    end
    return count
end

-- Function to find a table with a specific value
local function find_survey_by_kv(k, v)
    for i, inner_table in ipairs(Surveys) do
        if inner_table[k] == v then
            return inner_table
        end
    end
    return nil -- Return nil if not found
end

--[[
     Add handlers for each incoming Action
   ]]
--

--[[
     Info
   ]]
--
Handlers.add(
    "info",
    Handlers.utils.hasMatchingTag("Action", "Info"),
    function(msg)
        ao.send(
            {
                Target = msg.From,
                Tags = {
                    Name = Name,
                    UsersCount = users_count(),
                    SurveysCount = #Surveys
                }
            }
        )
    end
)
--[[
     GetSurveys
   ]]
--
Handlers.add(
    "getSurveys",
    Handlers.utils.hasMatchingTag("Action", "GetSurveys"),
    function(msg)
        ao.send({Target = msg.From, Data = json.encode(Surveys)})
    end
)
--[[
     GetUsers
   ]]
--
Handlers.add(
    "getUsers",
    Handlers.utils.hasMatchingTag("Action", "GetUsers"),
    function(msg)
        ao.send(
            {
                Target = msg.From,
                Data = json.encode(Users)
            }
        )
    end
)
--[[
     GetSurveyByKv
   ]]
--
Handlers.add(
    "getSurveyByKv",
    Handlers.utils.hasMatchingTag("Action", "GetSurveyByKv"),
    function(msg)
        assert(type(msg.Tags.Key) == "string", "err_invalid_ao_id")
        assert(type(msg.Tags.Val) == "string", "err_invalid_ao_id")
        local survey = find_survey_by_kv(msg.Tags.Key, msg.Tags.Val)

        if survey then
            ao.send(
                {
                    Target = msg.From,
                    Data = json.encode(survey)
                }
            )
        end
    end
)

--[[
     GetUserSurveyIds
   ]]
--
Handlers.add(
    "getUserSurveyIds",
    Handlers.utils.hasMatchingTag("Action", "GetUserSurveyIds"),
    function(msg)
        local address = msg.Tags.UserAddress
        assert(type(address) == "string", "err_invalid_address")
        ao.send(
            {
                Target = msg.From,
                Data = json.encode(Users[address])
            }
        )
    end
)

--[[
     AddSurvey
   ]]
--
Handlers.add(
    "addSurvey",
    Handlers.utils.hasMatchingTag("Action", "AddSurvey"),
    function(msg)
        local local_s = json.decode(msg.Data)
        -- print(local_s)
        local valid, err = validateInstance(local_s, template)
        assert(valid, "Recipient is required!")

        if not Users[msg.From] then
            Users[msg.From] = {}
        end

        local_s["ao_id"] = msg.Id
        local_s["ao_sender"] = msg.From

        table.insert(Surveys, local_s)
        table.insert(Users[msg.From], msg.Id)
        ao.send(
            {
                Target = msg.From,
                Tags = {
                    Action = "Survey-Added"
                }
            }
        )
    end
)
