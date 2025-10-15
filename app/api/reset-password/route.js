import { connectToDB } from '@/utils/database';
import User from '@/models/user';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { MailtrapClient } from 'mailtrap';

export async function POST(request) {
    try {
        await connectToDB();
        console.log('DB connected');

        const { email } = await request.json();
        console.log('Email:', email);

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return NextResponse.json({ success: true });
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000;
        await user.save();
        console.log('User updated with reset token');

        // Mailtrap HTTP API verwenden
        const client = new MailtrapClient({
            token: process.env.EMAIL_SERVER_PASSWORD, // Dein API Token
        });

        const sender = {
            email: process.env.EMAIL_FROM,
            name: "YourWinChallenge",
        };

        const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password/${resetToken}`;

        await client.send({
            from: sender,
            to: [{ email: user.email }],
            subject: "Passwort zurücksetzen - YourWinChallenge",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Passwort zurücksetzen</h2>
                    <p>Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts erhalten.</p>
                    <p>Klicken Sie auf den folgenden Link, um Ihr Passwort zurückzusetzen:</p>
                    <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #a6916e; color: #000; text-decoration: none; border-radius: 4px; margin: 16px 0;">
                        Passwort zurücksetzen
                    </a>
                    <p>Oder kopieren Sie diesen Link in Ihren Browser:</p>
                    <p style="word-break: break-all; color: #666;">${resetUrl}</p>
                    <p>Dieser Link ist 1 Stunde gültig.</p>
                    <p>Falls Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren.</p>
                </div>
            `,
            text: `Passwort zurücksetzen\n\nSie haben eine Anfrage zum Zurücksetzen Ihres Passworts erhalten.\n\nKlicken Sie auf den folgenden Link: ${resetUrl}\n\nDieser Link ist 1 Stunde gültig.`,
            category: "Password Reset",
        });

        console.log('Reset email sent via Mailtrap API');
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Password reset error:', error);
        return NextResponse.json(
            { message: 'Error sending reset email', error: error.message },
            { status: 500 }
        );
    }
}