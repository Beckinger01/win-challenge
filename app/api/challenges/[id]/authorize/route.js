// app/api/challenges/[id]/authorize/route.js
import { connectToDB } from '@/utils/database';
import Challenge from '@/models/challenge';
import User from '@/models/user';  // Wichtig: User-Modell importieren
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

export async function GET(request, context) {
  const { id } = await context.params;
  
  try {
    await connectToDB();
    
    // Überprüfe die Session des Benutzers
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ authorized: false, reason: 'not_authenticated' }, { status: 401 });
    }
    
    // Hole die Challenge aus der Datenbank
    const challenge = await Challenge.findById(id);
    
    if (!challenge) {
      return NextResponse.json(
        { authorized: false, reason: 'challenge_not_found' },
        { status: 404 }
      );
    }
    
    // Debug: Logge Infos zur Problemfindung
    console.log('Session user:', session.user);
    console.log('Challenge creator:', challenge.creator);
    
    // Hole den Benutzer aus der Datenbank, um seine ID zu erhalten
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
    
    // Vergleiche die Benutzer-ID mit der Creator-ID der Challenge
    // Beides sind MongoDB-Objekte, daher vergleichen wir als Strings
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