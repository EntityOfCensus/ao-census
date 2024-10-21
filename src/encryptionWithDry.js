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
                { name: 'Val', value: "KgAAAJ2VsnrcJ1fMQgPU7r28ESRuYnEu5D2e5aB9q98n8vyy4N0T8/bDYVVGx/IzR52PEaYiKQlSAHNqwD/GXqxyvr3zK5NHo52bI4uqxbfVrdorI7D+i3qdJR8NnxWTUOjTgCNK/YbTM5pFYwqjrDTtDVXd1f0GV3WHhhTAFNWYsDxTuAEqeHVpn+4Wi3cgbzkzUfalbpWAkblqqOP0GG7zUOU/BpGRxCtkisgVJj8XDFp5RwEuaO3biKLvNcLuv5MM7nXUi63Z8BpdZnDp+JgWwxpf7iyXJYZnXIl1hHWRb/iaHRMiIsXik0f2NgvIbCzlGEK77+JyT/0SDtay3wFoiBjteX0+4iIqFML3HchWyhRHswNtPh0GrtfTzX61cWiuzuJ60THKXC1vU7v/CXG72m+blMvME9Vi5IgZXF9dRL0nXqB2m95mw7IjXNKdwIz+Gng4FoieO++YwYM6bczDuchxeiBU4qTtaYkGyBgTW2CNtKTzwiqWCnojnIGrv/qbMfc5yL2iPTXCuq+1ONUMB92LW1r5mLHcB2gzbQ79HWoduxHRoTLc/IjCdVEiWzcwkMndpYrwvkqPMgVQC8zYzJRNJOMUWHnFKKnKkd54GNW62GDB8jawE/5zXpWO6H3HnT995K/k4JJ8wSczWWPkmSld0tqoBCD+rYzC1fDbmR1I8RovI88iifxcA2dZjCePm/aFif1o+/1I+EaABda5GLFbZnfPbw+i9E/O0PQipGo3BkY8uEiie5z+nENzyp7LlzirdRpYulvm3QqWLwwEELvw5EwjhhY3ctXGXmq6gwH1SmeRnZlhgE/BYP+tDPpJjkcal+hQlbolkNSylPBsRN0RPY7+EJx/nQsdJA3DKAC5hCDSEbS/2eEtUvgwjtMrNHuk85KVA4uDq8XeXLEy1P4Cdj6rS0AgLBBugTzj+AUbSVAVKjoXHal7rQHcaGilivxaXRHuqBX1uF4NSsBhqYHs4AX+aXggCd0icTDLzB0J4GsDQmoTTp62iRMILf6t0WcQXiIAV2gfMGX7ndvrTr0dJunkXad26jKtgDSA1kVGcYe1wY9n9IQaZeIVLl6QcwY4KV1+5Lj7Cz8MXQjfQiijiStLXfrR6Lcy9obyOJ98M22S6dg8J4NsstG/TOfPxu9Ra1nfkqyS8ciG8kN3ClaSmTcFYxpBHi83bDD2Rj6XsZ79hkV6G72BLq4COfs8ooX60Fz2RY2yjwiyMy9Y+BjoQ9qS/11YtDAqoYODcUO1CMs8vzXcNC83EApdQx3lUNR8J1ulnX9gKVQwV17hwgSkxXM0/6KhQa5F40vCk8QigoZ32krBqBIrLwehuoh9AvdLHHARvhAQoL9BZQaD/EesV2xk8W7WOiKxNTxqWaQuVspNFCPmaHymkesC2fNQjzhbqZxF2vj0h1IM9PySLjxaY4L+26ITBg00MevcFyp2YbcVpa9MdwiQyEDSyFBDPcKvnWLPIUbriAB1xYTgKyurQHGae1hmFoZb0SjUWiuLWt4xbEn5ND6A1TjjAovpHD995FFttiuG51ySZ3BLbbYhs6ajyE0INYd9ck5L9dpwS6Q9dd/vOjYlUqCrqc6gLKS5P1q90VgLbWY+w1op+k7oBvh20uYgdp8qfIj5fE20v3Lm2o6kSjvF851/abrb4oewqqIyYcDg24VCPhoGmWGU3U1PP0fgbzXxWHHo71x9I+7dv2GDRI7Xe3mDaTHGcCHAXNrTACDyYxcoZC6V9s+eH7xaa0V1eO1WFHrOJBujoWsjTOEcyJZThWPSLw6Y0RrOasGOBv+nROCnXWKFqKTgKYffp1AL9PqORZfYa45Tc4IsRJBTIJJ1GdCxwayiVBQN8hzQT1nv6Nw3hd5X4anmCpTgAqVQSYBuHAaW6zjCbYaCmXMt/EbQkAoio6/EBA3VnzPbY+r0Dlem1Y7h3r2GQcMuZZj4b1RjRlu/CgrtScpcjwAp6tH3/kHD/l3pRydkbDF84uTIkOIniJDpYT2UPmd8QGJbCbYEZp9PSqU5B42ov9PelVu9NRjNm+VICGnPRfq7Xv4LXxEDrIEkmOWZbCIEGqx15sTQLF1BJYvuLH1XTODgpB44df44TonFd1Nfj8U7rmegyCxM8pk35q319KaxbeAPK5GPH8M0NrLgGngPpX1ToTyDhRnDCCbui1rUKBmoKx78mUidpxNq7FtJJzUHXV112+ErtehvKnKq4N1b9zqhBobNdbAJb0CFKvTlMqTQp0gGFck0aECGOOmKMGtcfw+8Mw1mohxCg9LfpyN75oJqSbHXC8QOw5qZ9+Ox2YdoGxD3BuE1o3c1ZVX3YSA9yMfHG1LEGGx2VTzsefuVTO+hXFBanlL8XUmS38RQhLl4fD5m9dbZ2DzA9leu1LjeBoXIuYiCXBl1YZ9CkYeHmsfOiKK3Hi6iYcwdmTIcnTxCMx3qidLeC4OxEZ2PZRC7YWoHGbgQ27CYjvzl8rhxm0bhcC172KOtnwifmDRqZgmYfH+cd0fxV9u3LHBX06uUwnZpImX/lRGMslOeWkQoSmUU3XFd8CaSYkEscB8nNdvtmtmkeut7p6En2QRtdb48jl6aw0PMwzZAzkFe/pyBYMFZ0Kck6t1EAdNCsAkZ6+BY9FapFQVacOvrpV9rYkFRd9R+gRNzk2O6gYNxjlOZ4YviYG1JvSh47SZ6zWozQBUr45ybqf/s3nfdVC91xzVQ25Ehh65nAzd4Wn2s0nSyshFed7p+gLhWC1jwZWdQQpvFKU+8FAo9BHOcobOwpZ/r6CkFASYwb7wH76SR3vU3czcjjoWpDh4gedCYMwHXI6ftx3oZ7bzgJ50i0mEzTxaxj8KHJrx1KYFgi4bluI43IAkQ+U7PGftluXuMXkUHxfoUiMfeCaOyBPaYh+MEOmlnmNlrSHumKfE5pH4uOuFoeM7QWpQyYQ7hEHboJoLdphe9GnVYCClFqsjEzZH039cacLW2D9H7noxAbhkiIa8qeRXWNjZnIsDIpDAQ98DeQmgj9xNhuqSrMXbnbMK6MrL768L6wqIpoJliaYGIAVf92BqYVKtEdiva0SX19mKhfOfjAR9R1ZGV05i5o8NMpcsN/E+vkDeDY/hVzhch+nTRqyOwXmHmikwKSlDC31Oph5kiThfF8nRKw3S/Jz7Z3f/pnOZrgV1EGnukt2nEkBtm7Dwx2pYKx2SsIA4yX7X3wNEXZLuSghzO4Pt/mXTwDPAioM3kRj4YuGC56VoURAbukmbmn8Yel9KATzQtuPRYA6NQu9QmElISb/1QDRGIMnJsuMbM2K5inw++KJDTWEy5C4OhtYxYk1KBfoz/WdX9LTf9fXVjXKDAQrKCA27JYkyuxDe0jmp0SJEAAABI4XqkOw==" },
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
