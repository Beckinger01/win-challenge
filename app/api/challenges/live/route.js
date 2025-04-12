// app/api/challenges/live/route.js

import { connectToDB } from '@/utils/database';
import Challenge from '@/models/challenge';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        await connectToDB();

        // Find challenges that are active (not completed and have running timers)
        const liveChallenges = await Challenge.find({
            completed: { $ne: true },
            $or: [
                { 'timer.isRunning': true },
                { 'games.timer.isRunning': true }
            ]
        }).sort({ 'timer.startTime': -1 }); // Sort by start time, most recent first

        return NextResponse.json(liveChallenges);
    } catch (error) {
        console.error('Error fetching live challenges:', error);
        return NextResponse.json(
            { message: 'Error fetching live challenges' },
            { status: 500 }
        );
    }
}