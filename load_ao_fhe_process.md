# AO FHE Process walkthrough

## First step load ao process with FHE module lib

```sh
aos process_name --module=lZ-vBcgqmfOS8uqLhVkuo5I4Lfh1bEyqL4V93qZ6K2I
```

## Load process aofhe.lua 

It will add action tags to encrypt and decrypt integer values, store encryption block and run sum operation on integer value encrypted blocks

```sh 
.load process/aofhe.lua 
```

## Test you process 

In local .env file is must to be define "JWT" the wallet secret key and "FHE_PROCESS_ID" the process id with FHE module support 


```sh 
node src/aofhe.js 
```