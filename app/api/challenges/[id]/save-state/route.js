// app/api/challenges/[id]/save-state/route.js
import { connectToDB } from '@/utils/database';
import Challenge from '@/models/challenge';
import User from '@/models/user';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

export async function PUT(request, context) {
  const { id } = await context.params;
  
  try {
    await connectToDB();
    
    // Autorisierungsprüfung
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ message: 'Nicht autorisiert' }, { status: 401 });
    }
    
    // Challenge aus der Datenbank holen
    const challenge = await Challenge.findById(id);
    
    if (!challenge) {
      return NextResponse.json(
        { message: 'Challenge nicht gefunden' },
        { status: 404 }
      );
    }
    
    // Prüfen, ob der Benutzer der Ersteller ist
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return NextResponse.json(
        { message: 'Benutzer nicht gefunden' },
        { status: 404 }
      );
    }
    
    const isCreator = user._id.toString() === challenge.creator.toString();
    
    if (!isCreator) {
      return NextResponse.json(
        { message: 'Nur der Ersteller darf die Challenge aktualisieren' },
        { status: 403 }
      );
    }
    
    // Daten aus dem Request-Body erhalten
    const { challenge: updatedChallengeData } = await request.json();
    
    // Aktualisiere die Challenge-Daten
    // Timer-Felder aktualisieren
    if (updatedChallengeData.timer) {
      challenge.timer.duration = updatedChallengeData.timer.duration || challenge.timer.duration;
      challenge.timer.isRunning = updatedChallengeData.timer.isRunning;
      challenge.timer.startTime = updatedChallengeData.timer.startTime || challenge.timer.startTime;
      challenge.timer.endTime = updatedChallengeData.timer.endTime || challenge.timer.endTime;
      challenge.timer.pausedTime = updatedChallengeData.timer.pausedTime || challenge.timer.pausedTime;
      challenge.timer.lastPauseTime = updatedChallengeData.timer.lastPauseTime || challenge.timer.lastPauseTime;
    }
    
    // Pause-Timer aktualisieren oder erstellen
    if (!challenge.pauseTimer) {
      challenge.pauseTimer = {};
    }
    
    if (updatedChallengeData.pauseTimer) {
      challenge.pauseTimer.duration = updatedChallengeData.pauseTimer.duration || 0;
      challenge.pauseTimer.isRunning = updatedChallengeData.pauseTimer.isRunning || false;
    }
    
    // Spiele aktualisieren
    if (updatedChallengeData.games && updatedChallengeData.games.length === challenge.games.length) {
      updatedChallengeData.games.forEach((updatedGame, index) => {
        const gameInDB = challenge.games[index];
        
        if (updatedGame.timer) {
          gameInDB.timer.duration = updatedGame.timer.duration || gameInDB.timer.duration;
          gameInDB.timer.isRunning = updatedGame.timer.isRunning;
          gameInDB.timer.startTime = updatedGame.timer.startTime || gameInDB.timer.startTime;
          gameInDB.timer.endTime = updatedGame.timer.endTime || gameInDB.timer.endTime;
          gameInDB.timer.pausedTime = updatedGame.timer.pausedTime || gameInDB.timer.pausedTime;
          gameInDB.timer.lastPauseTime = updatedGame.timer.lastPauseTime || gameInDB.timer.lastPauseTime;
        }
        
        // Andere Spielfelder aktualisieren
        gameInDB.currentWins = updatedGame.currentWins || gameInDB.currentWins;
        gameInDB.completed = updatedGame.completed || gameInDB.completed;
      });
    }
    
    // Status-Felder aktualisieren
    challenge.completed = updatedChallengeData.completed || challenge.completed;
    challenge.paused = updatedChallengeData.paused || challenge.paused;
    challenge.forfeited = updatedChallengeData.forfeited || challenge.forfeited;
    
    if (updatedChallengeData.completedAt) {
      challenge.completedAt = updatedChallengeData.completedAt;
    }
    
    // Speichern der Änderungen
    await challenge.save();
    
    console.log(`Challenge ${id} Status gespeichert`);
    
    return NextResponse.json(challenge);
  } catch (error) {
    console.error('Error saving challenge state:', error);
    return NextResponse.json(
      { message: 'Error saving challenge state', error: error.message },
      { status: 500 }
    );
  }
}