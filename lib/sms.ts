
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const apiKeySid = process.env.TWILIO_API_KEY_SID;
const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;
const fromPhone = process.env.TWILIO_PHONE_NUMBER || '+15005550006'; // Magic number for success

// Initialize Client only if we have credentials
const client = (accountSid && apiKeySid && apiKeySecret)
    ? twilio(apiKeySid, apiKeySecret, { accountSid })
    : null;

export async function sendSms(to: string, body: string) {
    if (!client) {
        console.log(`[MOCK SMS] To: ${to} | Body: ${body}`);
        return { success: true, mock: true };
    }

    try {
        await client.messages.create({
            body,
            from: fromPhone,
            to
        });
        return { success: true };
    } catch (error) {
        console.error("Twilio Error:", error);
        return { success: false, error };
    }
}

export function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
