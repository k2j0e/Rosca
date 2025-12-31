
import twilio from 'twilio';

// No top-level init to avoid build-time env capture issues in Vercel Edge/Serverless
// We initialize lazily inside the function.

export async function sendSms(to: string, body: string) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const apiKeySid = process.env.TWILIO_API_KEY_SID;
    const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER;

    console.log(`[SMS Runtime] From: ${fromPhone}, SID: ${accountSid?.slice(0, 4)}...`);

    if (!accountSid || !apiKeySid || !apiKeySecret || !fromPhone) {
        const missing = [];
        if (!accountSid) missing.push("TWILIO_ACCOUNT_SID");
        if (!apiKeySid) missing.push("TWILIO_API_KEY_SID");
        if (!apiKeySecret) missing.push("TWILIO_API_KEY_SECRET");
        if (!fromPhone) missing.push("TWILIO_PHONE_NUMBER");

        console.error("Twilio Config Missing (Runtime):", missing.join(", "));
        return { success: false, error: { message: `Missing Config: ${missing.join(", ")}` } };
    }

    const client = twilio(apiKeySid, apiKeySecret, { accountSid });

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
