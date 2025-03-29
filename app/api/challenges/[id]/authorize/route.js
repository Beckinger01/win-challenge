import { connectToDB } from '@/utils/database';
import Challenge from '@/models/challenge';
import User from '@/models/user';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

export async function GET(request, context) {
  const { id } = await context.params;

  try {
    await connectToDB();

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ authorized: false, reason: 'not_authenticated' }, { status: 401 });
    }

    const challenge = await Challenge.findById(id);

    if (!challenge) {
      return NextResponse.json(
        { authorized: false, reason: 'challenge_not_found' },
        { status: 404 }
      );
    }

    console.log('Session user:', session.user);
    console.log('Challenge creator:', challenge.creator);

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      console.log('User not found for email:', session.user.email);
      return NextResponse.json(
        { authorized: false, reason: 'user_not_found' },
        { status: 404 }
      );
    }

    console.log('User from DB:', user);
    console.log('User ID:', user._id.toString());
    console.log('Creator ID:', challenge.creator.toString());
    const isAuthorized = user._id.toString() === challenge.creator.toString();

    return NextResponse.json({
      authorized: isAuthorized,
      userId: user._id.toString(),
      creatorId: challenge.creator.toString()
    });
  } catch (error) {
    console.error('Error in authorization check:', error);
    return NextResponse.json(
      { authorized: false, reason: 'server_error', error: error.message },
      { status: 500 }
    );
  }
}