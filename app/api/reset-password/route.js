import { connectToDB } from '@/utils/database';
import User from '@/models/user';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

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

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER_HOST,
            port: Number(process.env.EMAIL_SERVER_PORT),
            secure: false,
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.EMAIL_SERVER_PASSWORD
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: user.email,
            subject: 'Passwort zurücksetzen',
            html: `<p>Reset link: <a href="${process.env.NEXTAUTH_URL}/reset-password/${resetToken}">Klicke hier</a></p>`
        });

        console.log('Reset email sent');
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Password reset error:', error);
        return NextResponse.json(
            { message: 'Error sending reset email', error: error.message },
            { status: 500 }
        );
    }
}