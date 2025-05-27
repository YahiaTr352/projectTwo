const axios = require('axios');

async function sendSMSWithTextBee(phoneNumber, message) {
    const API_KEY = "YOUR_TEXTBEE_API_KEY"; // استبدلها بـ API Key تبعك
    const DEVICE_ID = "YOUR_DEVICE_ID";     // من التطبيق

    try {
        const response = await axios.post('https://textbee.dev/api/send', {
            to: phoneNumber,
            message: message,
        }, {
            headers: {
                'Authorization': API_KEY,
                'Device-ID': DEVICE_ID,
                'Content-Type': 'application/json'
            }
        });

        console.log("✅ SMS Sent:", response.data);
        return response.data;
    } catch (err) {
        console.error("❌ SMS Error:", err.response?.data || err.message);
        throw err;
    }
}
