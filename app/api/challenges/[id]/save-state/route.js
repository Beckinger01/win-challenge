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

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: 'Nicht autorisiert' }, { status: 401 });
    }

    const { challenge: updatedChallengeData } = await request.json();

    if (!updatedChallengeData) {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }

    const challenge = await Challenge.findById(id);

    if (!challenge) {
      return NextResponse.json({ message: 'Challenge nicht gefunden' }, { status: 404 });
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ message: 'Benutzer nicht gefunden' }, { status: 404 });
    }

    const isCreator = user._id.toString() === challenge.creator.toString();

    if (!isCreator) {
      return NextResponse.json({ message: 'Nur der Ersteller darf die Challenge aktualisieren' }, { status: 403 });
    }

    challenge.completed = updatedChallengeData.completed ?? challenge.completed;
    challenge.paused = updatedChallengeData.paused ?? challenge.paused;
    challenge.forfeited = updatedChallengeData.forfeited ?? challenge.forfeited;

    if (updatedChallengeData.completedAt) {
      challenge.completedAt = updatedChallengeData.completedAt;
    }

    if (!challenge.pauseTimer) {
      challenge.pauseTimer = {};
    }
    if (updatedChallengeData.pauseTimer) {
      challenge.pauseTimer.duration = updatedChallengeData.pauseTimer.duration ?? 0;
      challenge.pauseTimer.isRunning = updatedChallengeData.pauseTimer.isRunning ?? false;
      if (challenge.pauseTimer.isRunning && !challenge.pauseTimer.startTime) {
        challenge.pauseTimer.startTime = new Date();
      }
    }

    if (updatedChallengeData.games && updatedChallengeData.games.length === challenge.games.length) {
      updatedChallengeData.games.forEach((updatedGame, index) => {
        const gameInDB = challenge.games[index];
        if (!gameInDB) return;

        gameInDB.currentWins = updatedGame.currentWins ?? gameInDB.currentWins;
        gameInDB.completed = updatedGame.completed ?? gameInDB.completed;

        if (updatedGame.timer && !gameInDB.timer.isRunning && !gameInDB.completed) {

          console.warn(`Skipping timer sync for game ${index} in save-state (running/paused)`);
        } else if (updatedGame.timer && (gameInDB.completed || !gameInDB.timer.isRunning)) {
          gameInDB.timer.duration = updatedGame.timer.duration ?? gameInDB.timer.duration;
          gameInDB.timer.endTime = updatedGame.timer.endTime ?? gameInDB.timer.endTime;
        }

      });
    }

    await challenge.save();

    console.log(`Challenge ${id} state safely saved (timers preserved)`);

    if (typeof global.io !== 'undefined') {
      global.io.to(`challenge-${id}`).emit('challenge-updated', challenge);
    }

    return NextResponse.json(challenge);
  } catch (error) {
    console.error('Error saving challenge state:', error);
    return NextResponse.json(
      { message: 'Error saving challenge state', error: error.message },
      { status: 500 }
    );
  }
}
