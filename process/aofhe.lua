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

    - GetEncryption(): getter -- return the table of all encryption.

    - EncryptIntegerValue(Val: String): getter -- Encrypt an integer value.

    - DecryptIntegerValue(Val: String): getter -- Decrypt an integer value.

    - ComputeOperationOnEncryptedData(operation: string, ao_id_val_left: string, ao_id_val_right): getter -- get compute encrypted values operation data

    - GetDataByKv(Key: String, Val: String): getter -- return a data encrypted block via KV inputs.

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

-- Function to find a table with a specific value
local function find_data_by_kv(k, v)
    for i, inner_table in ipairs(Encryption) do
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
     GetEncryption
   ]]
--
Handlers.add(
    "getEncryption",
    Handlers.utils.hasMatchingTag("Action", "GetEncryption"),
    function(msg)
        ao.send({Target = msg.From, Data = json.encode(Encryption)})
    end
)

--[[
     EncryptIntegerValue
   ]]
--
Handlers.add(
    "EncryptIntegerValue",
    Handlers.utils.hasMatchingTag("Action", "EncryptIntegerValue"),
    function(msg)
        local local_s = Tfhe.encryptInteger(msg.Tags.Val, "key")
        if local_s then
            ao.send(
                {
                    Target = msg.From,
                    Tags = {
                        Action = "StoreEncryptedData"
                    },
                    Data = local_s
                }
            )
        end
    end
)

--[[
     DecryptIntegerValue
   ]]
--
Handlers.add(
    "DecryptIntegerValue",
    Handlers.utils.hasMatchingTag("Action", "DecryptIntegerValue"),
    function(msg)
        local local_s = Tfhe.decryptInteger(msg.Tags.Val, "key")
        if local_s then
            ao.send(
                {
                    Target = msg.From,                    
                    Data = local_s
                }
            )
        end
    end
)

--[[
     GetDataByKv
   ]]
--
Handlers.add(
    "getDataByKv",
    Handlers.utils.hasMatchingTag("Action", "GetDataByKv"),
    function(msg)
        assert(type(msg.Tags.Key) == "string", "err_invalid_ao_id")
        assert(type(msg.Tags.Val) == "string", "err_invalid_ao_id")
        local data = find_data_by_kv(msg.Tags.Key, msg.Tags.Val)
        print(data)
        -- if data then
            ao.send(
                {
                    Target = msg.From,
                    Data = data and json.encode(data) or "No Data"
                }
            )
        -- end
    end
)

--[[
     ComputeOperationOnEncryptedData
   ]]
--
Handlers.add(
    "computeOperationOnEncryptedData",
    Handlers.utils.hasMatchingTag("Action", "ComputeOperationOnEncryptedData"),
    function(msg)
        if(msg.Tags.operation == "add") then
            local data1 = find_data_by_kv("ao_id", msg.Tags.ao_id_val_left)
            local data2 = find_data_by_kv("ao_id", msg.Tags.ao_id_val_right)                                            
            local local_s = Tfhe.addCiphertexts(json.decode(data1.data).value, json.decode(data2.data).value, "")
            ao.send({
                    Target = msg.From,
                    Data = local_s
                })        
        else 
            ao.send( {
                Target = msg.From,
                Data = "Operation not supported"
            })
        end
    end
)


--[[
     StoreEncryptedData
   ]]
--
Handlers.add(
    "storeEncryptedData",
    Handlers.utils.hasMatchingTag("Action", "StoreEncryptedData"),
    function(msg)
        local local_s = {} 

        if not Users[msg.From] then
            Users[msg.From] = {}
        end

        local_s["data"] = msg.Data
        local_s["ao_id"] = msg.Id
        local_s["ao_sender"] = msg.From

        print(local_s)
        table.insert(Encryption, local_s)
        table.insert(Users[msg.From], msg.Id)    
        ao.send(
            {
                Target = msg.From,
                Tags = {
                    Action = "EncryptedData-Added"
                },
                Data = local_s
            }
        )
    end
)
