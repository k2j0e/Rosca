import { Resend } from 'resend';

// Lazy initialization to avoid errors during build
let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
    if (!resendClient) {
        if (!process.env.RESEND_API_KEY) {
            console.error('[Email] RESEND_API_KEY not set');
            return null;
        }
        resendClient = new Resend(process.env.RESEND_API_KEY);
    }
    return resendClient;
}

export async function sendEmailOtp(email: string, code: string): Promise<{ success: boolean; error?: string }> {
    try {
        const resend = getResendClient();

        if (!resend) {
            return { success: false, error: 'Email service not configured' };
        }

        // Use Resend sandbox email for testing (works without domain verification)
        const fromEmail = 'Orbit <onboarding@resend.dev>';
        console.log('[sendEmailOtp] Sending to:', email, 'from:', fromEmail);

        const { error, data } = await resend.emails.send({
            from: fromEmail,
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

        console.log('[sendEmailOtp] Email sent successfully, id:', data?.id);
        return { success: true };
    } catch (err: any) {
        console.error('[sendEmailOtp] Error:', err?.message || err);
        return { success: false, error: err?.message || 'Failed to send email' };
    }
}

