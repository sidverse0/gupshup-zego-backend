const express = require('express');
const cors = require('cors');
const { generateToken04 } = require('zego-server-assistant');

const app = express();
app.use(cors());
app.use(express.json());

// ==========================================
// 🛡️ TERA ZEGO CREDENTIALS (AB SERVER ME SAFE HAIN)
// ==========================================
const appID = 1259477981; 
const serverSecret = "feb7f385d54db1c82afd132af10a82b7d60de562804a18078619b8bba253a2b6"; 

// 1. TERA SECURE TOKEN GENERATOR
app.get('/api/getToken', (req, res) => {
    const userID = req.query.userID;
    
    if (!userID) {
        return res.status(400).json({ error: "userID is required" });
    }

    // Token ki validity 1 ghanta (3600 seconds) rakhte hain
    const effectiveTimeInSeconds = 3600;
    const payload = ""; // Empty payload for normal calls
    
    try {
        // 🔥 ZEGO ENGINE ALGO (Server-Side Encryption)
        const token = generateToken04(appID, userID, serverSecret, effectiveTimeInSeconds, payload);
        
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
    const { callerName, avatarUrl, targetToken } = req.body;
    
    // Yahan aage chalkar hum Zego/FCM payload modify karenge
    res.json({ 
        success: true, 
        message: "Push route is active and ready for DP Injection!" 
    });
});

module.exports = app;