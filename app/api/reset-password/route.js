// app/api/reset-password/route.js
import { connectToDB } from '@/utils/database';
import User from '@/models/user';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
        await connectToDB();

        const { email } = await request.json();
        const user = await User.findOne({ email });

        if (!user) {
            // Even if user doesn't exist, return success for security
            return NextResponse.json({ success: true });
        }

        // Generate token and expiry
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = Date.now() + 3600000; // 1 hour from now

        // Save to user
        user.resetToken = resetToken;
        user.resetTokenExpiry = tokenExpiry;
        await user.save();

        // Create a transport for email
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER_HOST,
            port: process.env.EMAIL_SERVER_PORT,
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD
            }
        });

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: 'Passwort zurücksetzen',
            html: `
        <p>Du hast eine Anfrage zum Zurücksetzen deines Passworts gestellt.</p>
        <p>Bitte klicke auf den folgenden Link, um dein Passwort zurückzusetzen:</p>
        <a href="${process.env.NEXTAUTH_URL}/reset-password/${resetToken}">
          Passwort zurücksetzen
        </a>
        <p>Der Link ist für eine Stunde gültig.</p>
      `
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Password reset error:', error);
        return NextResponse.json(
            { message: 'Error sending reset email' },
            { status: 500 }
        );
    }
}