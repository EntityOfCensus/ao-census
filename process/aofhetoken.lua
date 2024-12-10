--[[
    Imports
]] --

local json = require("json")
local ao = require("ao")
local Tfhe = require("tfhe")

--[[
  This module implements the EntityOfCode AO FHE JWT Token Demo on ao
]]
--

--[[
  internal state
]]
--
Name = Name or "EntityOfCode AO FHE Demo"

--[[
     RegisterToken
   ]]
--
Handlers.add(
    "registerToken",
    Handlers.utils.hasMatchingTag("Action", "RegisterToken"),
    function(msg)
        local local_s = {} 


        local_s["data"] = msg.Data
        local_s["ao_id"] = msg.Id
        local_s["ao_sender"] = msg.From
        print(local_s)
        if local_s["data"] then
        Tfhe.generateSecretKey(json.decode(local_s["data"]).id_token, json.decode(local_s["data"]).jkws)      
        end
        ao.send(
            {
                Target = msg.From,
                Tags = {
                    Action = "RegisterToken"
                },
                Data = local_s
            }
        )
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
        local local_s = Tfhe.encryptInteger(msg.Data, "")
        if local_s then
            ao.send(
                {
                    Target = msg.From,
                    Tags = {
                        Action = "EncryptIntegerValue"
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
        -- local dataString = msg.Data -- Assuming msg.Data is a string representation of a number
        -- local dataNumber = tonumber(dataString)
        local local_s = Tfhe.decryptInteger(msg.Data, "", msg.Tags.id_token, msg.Tags.jkws)
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
     ComputeOperationOnEncryptedData
   ]]
--
Handlers.add(
    "computeOperationOnEncryptedData",
    Handlers.utils.hasMatchingTag("Action", "ComputeOperationOnEncryptedData"),
    function(msg)
        if(msg.Tags.operation == "add") then
            local data = json.decode(msg.Data)
            local local_s = Tfhe.addCiphertexts(data.param_value_left, data.param_value_right, "")
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