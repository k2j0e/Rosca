
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const apiKeySid = process.env.TWILIO_API_KEY_SID;
const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

// Initialize Client only if we have credentials
console.log(`[SMS Init] Account: ${!!accountSid}, Key: ${!!apiKeySid}, Secret: ${!!apiKeySecret}, From: ${fromPhone}`);

const client = (accountSid && apiKeySid && apiKeySecret && fromPhone)
    ? twilio(apiKeySid, apiKeySecret, { accountSid })
    : null;

export async function sendSms(to: string, body: string) {
    if (!client) {
        const missing = [];
        if (!accountSid) missing.push("TWILIO_ACCOUNT_SID");
        if (!apiKeySid) missing.push("TWILIO_API_KEY_SID");
        if (!apiKeySecret) missing.push("TWILIO_API_KEY_SECRET");
        if (!fromPhone) missing.push("TWILIO_PHONE_NUMBER");

        console.error("Twilio Client not initialized. Missing:", missing.join(", "));
        return { success: false, error: { message: `Missing Config: ${missing.join(", ")}` } };
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
