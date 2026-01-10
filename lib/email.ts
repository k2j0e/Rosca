import { Resend } from 'resend';

// Lazy initialization to avoid errors during build
let resendClient: Resend | null = null;

const HARDCODED_API_KEY = 're_ZrRywaxs_7qUow3woBtxWxMETwG5AVsRL';

function getResendClient(): Resend | null {
    if (!resendClient) {
        // SECURITY: Hardcoded fallback to unblock testing. Move to env var for actual production.
        const apiKey = process.env.RESEND_API_KEY || HARDCODED_API_KEY;

        if (!apiKey) {
            console.error('[Email] CRITICAL: Missing RESEND_API_KEY');
            return null;
        }
        resendClient = new Resend(apiKey);
    }
    return resendClient;
}

export async function sendEmailOtp(email: string, code: string): Promise<{ success: boolean; error?: string }> {
    try {
        const resend = getResendClient();

        if (!resend) {
            return { success: false, error: 'Email service not configured' };
        }

        // Production email from verified subdomain
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'Circle8 <noreply@email.circle8.ca>';
        console.log('[sendEmailOtp] Sending to:', email, 'from:', fromEmail);

        const { error, data } = await resend.emails.send({
            from: fromEmail,
            to: email,
            subject: `Your Circle8 verification code: ${code}`,
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 400px; margin: 0 auto; padding: 40px 20px;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <span style="font-size: 32px; font-weight: 800; background: linear-gradient(135deg, #FF6B35, #FF8F5E); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Circle8</span>
                    </div>
                    <h1 style="font-size: 24px; font-weight: 700; margin-bottom: 8px; color: #1a1a1a; text-align: center;">Verify your identity</h1>
                    <p style="color: #666; margin-bottom: 24px; text-align: center;">Enter this code to sign in to your Circle8 account:</p>
                    <div style="background: linear-gradient(135deg, #FFF5F0, #FFF0E8); border: 2px solid #FF6B35; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
                        <span style="font-size: 40px; font-weight: 800; letter-spacing: 8px; color: #FF6B35;">${code}</span>
                    </div>
                    <p style="color: #999; font-size: 14px; text-align: center;">This code expires in 10 minutes.</p>
                    <p style="color: #bbb; font-size: 12px; text-align: center; margin-top: 32px;">If you didn't request this code, you can safely ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
                    <p style="color: #999; font-size: 11px; text-align: center;">Circle8 - Community Savings Circles<br/>Save together, grow together.</p>
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

