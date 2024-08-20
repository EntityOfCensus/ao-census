--[[
    Imports
]] --

local json = require("json")
local ao = require("ao")
local Tfhe = require("eoc_tfhe")

--[[
  This module implements the EntityOfCode AO FHE Demo on ao

  Terms:
    Sender: the wallet or Process that sent the Message

  It will first initialize the internal state, define utils code blocks and then attach handlers.

    - Info(): Returns the process metadata, which includes the Name and the EncryptedMessageCount.

    - GetUsers(): This is a getter function that returns a table containing all users.

    - GetDecryptedValueByKv(Key: String, Val: String): A getter function that returns a decrypted value based on the provided key-value (KV) inputs.

    - AddOperationOnEncryptedDataBy(sumParamLeftKey: String, sumParamLeftVal: String, sumParamRightKey: String, sumParamRightVal: String): This function retrieves the encrypted values corresponding to the provided KV request parameters and performs a sum operation. It then generates a new encrypted data block with the result of this sum.

    - GetUserEncryptedDataBlocksIds(UserAddress: String): A getter function that returns the encryption data blocks issued by the specified user address.

    - StoreEncryptedData(Data: string): This function stores encrypted data. If the sender provides a correctly formatted instance of encrypted data, it adds the data to the Encryption table. Upon successful storage, an acknowledgment is sent back to the sender, confirming that the encryption value has been added.

]]
--

--[[
  internal state
]]
--
Encryption = Encryption or {}
Users = Users or {}
Name = Name or "EntityOfCode AO FHE Demo"

Tfhe.info()
Tfhe.generateSecretKey()

--[[
  utils helper functions
]]
--

-- The encrypted data template
local template = {
    type = "string",
    value = "string"
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
local function find_encripted_data_by_kv(k, v)
    for i, inner_table in ipairs(Encryption) do
        if inner_table[k] == v then
            return inner_table
        end
    end
    return nil -- Return nil if not found
end

--[[
     StoreEncryptedData
   ]]
--
Handlers.add(
    "storeEncryptedData",
    Handlers.utils.hasMatchingTag("Action", "StoreEncryptedData"),
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

        if(local_s.type == "string") then
            local_s["value"] = Tfhe.encryptString(local_s.value, "key")
        else
            if(local_s.type == "integer") then
                local_s["value"] = Tfhe.encryptInteger(local_s.value, "key")
            end     
        end    

        table.insert(Encryption, local_s)
        table.insert(Users[msg.From], msg.Id)    
        ao.send(
            {
                Target = msg.From,
                Tags = {
                    Action = "StoreEncryptedData - Added"
                }
            }
        )
    end
)
