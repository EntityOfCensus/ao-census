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

--[[
  utils helper functions
]]
--