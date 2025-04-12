// app/api/users/[id]/route.js

import { connectToDB } from '@/utils/database';
import User from '@/models/user';
import { NextResponse } from 'next/server';

export async function GET(request, context) {
    const { id } = await context.params;

    try {
        await connectToDB();

        // Find the user by ID, select only non-sensitive fields
        const user = await User.findById(id).select('username name email');

        if (!user) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        // Return only necessary user data
        return NextResponse.json({
            username: user.username || null,
            name: user.name || null,
            email: user.email || null
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json(
            { message: 'Error fetching user' },
            { status: 500 }
        );
    }
}