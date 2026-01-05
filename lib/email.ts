import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmailOtp(email: string, code: string): Promise<{ success: boolean; error?: string }> {
    try {
        const { error } = await resend.emails.send({
            from: process.env.EMAIL_FROM || 'Orbit <onboarding@resend.dev>',
            to: email,
            subject: `Your verification code: ${code}`,
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 400px; margin: 0 auto; padding: 40px 20px;">
                    <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 8px; color: #1a1a1a;">Your verification code</h1>
                    <p style="color: #666; margin-bottom: 24px;">Enter this code to verify your identity:</p>
                    <div style="background: #f5f5f5; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
                        <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1a1a1a;">${code}</span>
                    </div>
                    <p style="color: #999; font-size: 14px;">This code expires in 10 minutes. If you didn't request this, you can safely ignore this email.</p>
                </div>
            `,
        });

        if (error) {
            console.error('[sendEmailOtp] Resend error:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (err) {
        console.error('[sendEmailOtp] Error:', err);
        return { success: false, error: 'Failed to send email' };
    }
}
