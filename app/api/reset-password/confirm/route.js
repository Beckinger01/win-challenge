import { connectToDB } from '@/utils/database';
import User from '@/models/user';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(request) {
    try {
        await connectToDB();

        const { token, password } = await request.json();

        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return NextResponse.json(
                { message: 'Token is invalid or expired' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Password reset confirmation error:', error);
        return NextResponse.json(
            { message: 'Error resetting password' },
            { status: 500 }
        );
    }
}