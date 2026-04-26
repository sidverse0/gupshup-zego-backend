const express = require('express');
const cors = require('cors');
const crypto = require('crypto'); // 🔥 NATIVE NODE.JS MODULE (No NPM needed!)

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 🛡️ TERA ZEGO CREDENTIALS (SAFE IN BACKEND)
// ==========================================
const appID = 1259477981; 
const serverSecret = "5e1f41dd4e92ae06bd1ae4d6b8a2a657"; 

// ==========================================
// ⚙️ THE NATIVE TOKEN ENGINE (Bulletproof AES-256)
// ==========================================
function generateToken04(appId, userId, secret, effectiveTimeInSeconds, payload) {
    const createTime = Math.floor(Date.now() / 1000);
    const tokenInfo = {
        app_id: appId,
        user_id: userId,
        nonce: Math.floor(Math.random() * 2147483647),
        ctime: createTime,
        expire: createTime + effectiveTimeInSeconds,
        payload: payload || ''
    };
    
    const plainText = JSON.stringify(tokenInfo);
    let iv = Math.random().toString().substring(2, 18);
    if (iv.length < 16) iv = iv.padEnd(16, '0'); // Safe padding
    
    // 🔥 SURGICAL FIX: Force key to EXACTLY 32 bytes (Crash Killer)
    const key = Buffer.alloc(32);
    Buffer.from(secret, 'utf8').copy(key);
    
    const cipher = crypto.createCipheriv('aes-256-cbc', key, Buffer.from(iv, 'utf8'));
    const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
    
    const b1 = Buffer.alloc(8);
    b1.writeBigInt64BE(BigInt(tokenInfo.expire), 0);
    const b2 = Buffer.alloc(2);
    b2.writeUInt16BE(16, 0); // IV length
    const b3 = Buffer.from(iv, 'utf8');
    const b4 = Buffer.alloc(2);
    b4.writeUInt16BE(encrypted.length, 0); // Ciphertext length
    
    const buf = Buffer.concat([b1, b2, b3, b4, encrypted]);
    return '04' + buf.toString('base64');
}

// 1. TERA SECURE TOKEN ROUTE
app.get('/api/getToken', (req, res) => {
    const userID = req.query.userID;
    
    if (!userID) {
        return res.status(400).json({ error: "userID is required" });
    }

    const effectiveTimeInSeconds = 3600; // 1 Hour Validity
    
    try {
        const token = generateToken04(appID, userID, serverSecret, effectiveTimeInSeconds, "");
        res.json({ 
            success: true, 
            token: token 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. THE BLUE SCREEN DP INJECTOR (Rasta khol diya)
app.post('/api/sendCallPush', (req, res) => {
    res.json({ 
        success: true, 
        message: "Push route is active and ready!" 
    });
});

module.exports = app;
