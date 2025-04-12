// app/api/challenges/search/route.js

import { connectToDB } from '@/utils/database';
import Challenge from '@/models/challenge';
import User from '@/models/user';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        await connectToDB();

        const url = new URL(request.url);
        const name = url.searchParams.get('name');
        const creator = url.searchParams.get('creator');
        const from = url.searchParams.get('from');
        const to = url.searchParams.get('to');

        let query = {};
        let creatorIds = [];

        // Search by name
        if (name) {
            // Case-insensitive search for names containing the search term
            query.name = { $regex: name, $options: 'i' };
        }

        // Search by creator
        if (creator) {
            // First, find users whose username, name, or email contains the search term
            const users = await User.find({
                $or: [
                    { username: { $regex: creator, $options: 'i' } },
                    { name: { $regex: creator, $options: 'i' } },
                    { email: { $regex: creator, $options: 'i' } }
                ]
            }).select('_id');

            // If no users found, return empty array immediately
            if (users.length === 0) {
                return NextResponse.json([]);
            }

            // Extract user IDs
            creatorIds = users.map(user => user._id);
            query.creator = { $in: creatorIds };
        }

        // Search by date range
        if (from && to) {
            const fromDate = new Date(from);
            const toDate = new Date(to);

            // Set the time of toDate to the end of the day
            toDate.setHours(23, 59, 59, 999);

            query.createdAt = {
                $gte: fromDate,
                $lte: toDate
            };
        }

        // Execute the query
        const challenges = await Challenge.find(query)
            .sort({ createdAt: -1 }) // Sort by creation date, newest first
            .limit(50); // Limit to 50 results for performance

        return NextResponse.json(challenges);
    } catch (error) {
        console.error('Error searching challenges:', error);
        return NextResponse.json(
            { message: 'Error searching challenges' },
            { status: 500 }
        );
    }
}