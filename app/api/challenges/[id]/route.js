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

    const challenge = await Challenge.findById(id);

    if (!challenge) {
      return NextResponse.json(
        { message: 'Challenge not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(challenge);
  } catch (error) {
    console.error('Error fetching challenge:', error);
    return NextResponse.json(
      { message: 'Error fetching challenge' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, context) {
  const { id } = await context.params;

  try {
    await connectToDB();

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { message: 'Nicht autorisiert' },
        { status: 401 }
      );
    }

    const challenge = await Challenge.findById(id);

    if (!challenge) {
      return NextResponse.json(
        { message: 'Challenge nicht gefunden' },
        { status: 404 }
      );
    }

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
        { message: 'Nur der Ersteller darf die Challenge löschen' },
        { status: 403 }
      );
    }

    await Challenge.findByIdAndDelete(id);

    if (typeof global.io !== 'undefined') {
      global.io.to(`challenge-${id}`).emit('challenge-deleted', { id });
    }

    return NextResponse.json(
      { message: 'Challenge erfolgreich gelöscht' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting challenge:', error);
    return NextResponse.json(
      { message: 'Fehler beim Löschen der Challenge' },
      { status: 500 }
    );
  }
}

const calculateElapsed = (timer) => {
  if (!timer.startTime || !timer.isRunning) return timer.duration || 0;
  const now = new Date();
  const runningTime = now - new Date(timer.startTime);
  return Math.max(0, runningTime - (timer.pausedTime || 0));
};

export async function PUT(request, context) {
  const { id } = await context.params;
  try {
    await connectToDB();
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Nicht autorisiert' }, { status: 401 });
    }
    const body = await request.json();
    const { action, gameIndex, challengeTime, gameTimers, pauseTime, isPauseRunning, forfeited } = body;
    let challenge = await Challenge.findById(id);
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
    if (!challenge.pauseTimer) {
      challenge.pauseTimer = {};
    }
    // FIXED: Only handle client-provided times in STOP/COMPLETE actions. Ignore for start/pause/increment to avoid mid-run sets.
    const isStopAction = ['stop-all-timers', 'stop-challenge-timer', 'stop-game-timer', 'forfeited-challenge'].includes(action);
    if (isStopAction && challengeTime !== undefined) {
      // Trust client for challenge stop (as original), but only set if stopping.
      if (!challenge.timer.isRunning) challenge.timer.duration = challengeTime;
    }
    if (isStopAction && gameTimers && Array.isArray(gameTimers) && challenge.games) {
      challenge.games.forEach((game, index) => {
        if (gameTimers[index] !== undefined && !game.timer.isRunning) {
          game.timer.duration = gameTimers[index];  // Only for stopped games.
        }
      });
    }
    if (pauseTime !== undefined) {
      challenge.pauseTimer.duration = pauseTime;
    }
    if (isPauseRunning !== undefined) {
      challenge.pauseTimer.isRunning = isPauseRunning;
    }

    switch (action) {
      case 'start-challenge-timer':
        // ... (unchanged from previous fix)
        const now = new Date();
        if (!challenge.timer.isRunning) {
          if (!challenge.timer.startTime) {
            challenge.timer.startTime = now;
          } else if (challenge.timer.lastPauseTime) {
            const pauseDuration = now - challenge.timer.lastPauseTime;
            challenge.timer.pausedTime += pauseDuration;
            challenge.timer.lastPauseTime = null;
          }
          challenge.timer.isRunning = true;
          challenge.paused = false;
          if (challenge.pauseTimer && challenge.pauseTimer.isRunning) {
            challenge.pauseTimer.isRunning = false;
            challenge.pauseTimer.startTime = null;
          }
        }
        break;

      case 'stop-all-timers':
        challenge.timer.isRunning = false;
        if (challenge.timer.isRunning || challengeTime !== undefined) {
          challenge.timer.duration = challengeTime !== undefined ? challengeTime : calculateElapsed(challenge.timer);
        }
        challenge.completed = true;

        if (gameTimers && Array.isArray(gameTimers) && challenge.games) {
          challenge.games.forEach((game, index) => {
            game.timer.isRunning = false;
            if (gameTimers[index] !== undefined) {
              game.timer.duration = gameTimers[index];
            } else if (game.timer.isRunning) {
              game.timer.duration = calculateElapsed(game.timer);
            }
            game.timer.startTime = null;
            game.timer.pausedTime = 0;
            game.timer.lastPauseTime = null;
          });
        }

        if (challenge.pauseTimer) {
          challenge.pauseTimer.isRunning = false;
          if (pauseTime !== undefined) {
            challenge.pauseTimer.duration = pauseTime;
          }
        }
        break;

      case 'pause-challenge-timer':
        if (challenge.timer.isRunning) {
          const now = new Date();
          challenge.timer.lastPauseTime = now;
          challenge.timer.isRunning = false;
          challenge.paused = true;

          if (!challenge.pauseTimer.startTime) {
            challenge.pauseTimer.startTime = now;
          }
          challenge.pauseTimer.isRunning = true;
          if (pauseTime !== undefined) {
            challenge.pauseTimer.duration = pauseTime;
          }

          // Pause all game timers
          challenge.games.forEach((game) => {
            if (game.timer.isRunning) {
              game.timer.lastPauseTime = now;  // Set for later resume
              game.timer.isRunning = false;
            }
          });
        }
        break;

      case 'stop-challenge-timer':
        if (challenge.timer.startTime) {
          const endTime = new Date();
          challenge.timer.endTime = endTime;
          challenge.timer.duration = calculateElapsed(challenge.timer);
          challenge.timer.isRunning = false;
          challenge.completed = true;
          challenge.completedAt = endTime;
          challenge.timer.startTime = null;
          challenge.timer.pausedTime = 0;
          challenge.timer.lastPauseTime = null;

          if (challenge.pauseTimer) {
            challenge.pauseTimer.isRunning = false;
          }
        }
        break;

      case 'forfeited-challenge':  // Fixed typo from 'forfied'
        challenge.forfeited = true;
        if (challenge.timer.startTime) {
          const endTime = new Date();
          challenge.timer.endTime = endTime;
          challenge.timer.duration = calculateElapsed(challenge.timer);
          challenge.timer.isRunning = false;
          challenge.completed = true;
          challenge.completedAt = endTime;
          challenge.timer.startTime = null;
          challenge.timer.pausedTime = 0;
          challenge.timer.lastPauseTime = null;

          challenge.games.forEach((game) => {
            if (game.timer.isRunning) {
              game.timer.isRunning = false;
              if (game.timer.startTime) {
                game.timer.endTime = endTime;
                game.timer.duration = calculateElapsed(game.timer);
                game.timer.startTime = null;
                game.timer.pausedTime = 0;
                game.timer.lastPauseTime = null;
              }
            }
          });

          if (challenge.pauseTimer) {
            challenge.pauseTimer.isRunning = false;
          }
        }
        break;

      case 'start-game-timer':
        if (gameIndex !== undefined) {
          const now = new Date();

          // FIXED: Pause (don't stop) other running games—preserves their startTime for future resumes.
          for (let i = 0; i < challenge.games.length; i++) {
            if (i !== gameIndex && challenge.games[i].timer.isRunning) {
              const otherGame = challenge.games[i];

              // Pause logic: Set lastPauseTime, isRunning=false (no duration set, no clear).
              otherGame.timer.lastPauseTime = now;
              otherGame.timer.isRunning = false;
              // DO NOT: Set duration, clear startTime/pausedTime—keep for resume.

              console.log(`Paused other game ${i} during switch to ${gameIndex}`);  // Optional log.
            }
          }

          // Start/resume the target game (unchanged—handles new or resume).
          const game = challenge.games[gameIndex];
          if (game && !game.completed) {
            // If paused, resume by adding pause duration to pausedTime (preserve startTime).
            if (game.timer.lastPauseTime) {
              const pauseDuration = now - game.timer.lastPauseTime;
              game.timer.pausedTime += pauseDuration;
              game.timer.lastPauseTime = null;
            }

            // Only set startTime if this is a brand-new timer (no prior start).
            if (!game.timer.startTime) {
              game.timer.startTime = now;
              game.timer.pausedTime = 0;  // Ensure 0 for new starts.
            }

            // Reset lastPauseTime if somehow set (safety).
            if (game.timer.lastPauseTime) {
              game.timer.lastPauseTime = null;
            }

            game.timer.isRunning = true;

            // Optional log for diagnosis.
            console.log(`Started/resumed game ${gameIndex}: startTime=${game.timer.startTime?.toISOString()}, pausedTime=${game.timer.pausedTime}`);
          }
        }
        break;


      case 'pause-game-timer':
        if (gameIndex !== undefined) {
          const game = challenge.games[gameIndex];
          if (game && game.timer.isRunning) {
            game.timer.lastPauseTime = new Date();  // Ensure set for resume
            game.timer.isRunning = false;
          }
        }
        break;

      case 'stop-game-timer':
        if (gameIndex !== undefined) {
          const game = challenge.games[gameIndex];
          if (game && game.timer.startTime) {
            game.timer.duration = calculateElapsed(game.timer);
            game.timer.endTime = new Date();
            game.timer.isRunning = false;
            game.timer.startTime = null;
            game.timer.pausedTime = 0;
            game.timer.lastPauseTime = null;
          }
        }
        break;

      case 'increase-win-count':
        if (gameIndex !== undefined) {
          const game = challenge.games[gameIndex];
          if (game) {
            game.currentWins += 1;
            // LOG FOR DIAGNOSIS
            console.log(`Win increment for game ${gameIndex}: currentWins=${game.currentWins}/${game.winCount}, pre-completion state:`, {
              startTime: game.timer.startTime?.toISOString(),
              pausedTime: game.timer.pausedTime,
              isRunning: game.timer.isRunning,
              durationBefore: game.timer.duration,
              calculatedElapsedBefore: calculateElapsed(game.timer) / 1000 + 's'
            });
            if (game.currentWins >= game.winCount) {
              game.completed = true;
              if (game.timer.isRunning && game.timer.startTime) {
                const elapsed = calculateElapsed(game.timer);
                game.timer.duration = elapsed;  // Server calc - full time
                game.timer.endTime = new Date();
                game.timer.isRunning = false;
                game.timer.startTime = null;
                game.timer.pausedTime = 0;
                game.timer.lastPauseTime = null;
                // LOG
                console.log(`Game ${gameIndex} completed: final duration=${elapsed / 1000}s`);
              }
            }
            const allCompleted = challenge.games.every(g => g.completed);
            if (allCompleted) {
              challenge.completed = true;
              challenge.completedAt = new Date();
              if (challenge.timer.isRunning && challenge.timer.startTime) {
                const challengeElapsed = calculateElapsed(challenge.timer);
                challenge.timer.duration = challengeElapsed;
                challenge.timer.endTime = new Date();
                challenge.timer.isRunning = false;
                challenge.timer.startTime = null;
                challenge.timer.pausedTime = 0;
                challenge.timer.lastPauseTime = null;
              }
            }
          }
        }
        break

      default:
        return NextResponse.json(
          { message: 'Invalid action' },
          { status: 400 }
        );
    }

    await challenge.save();
    if (typeof global.io !== 'undefined') {
      global.io.to(`challenge-${id}`).emit('challenge-updated', challenge);
    }
    return NextResponse.json(challenge);
  } catch (error) {
    console.error('Error updating challenge:', error);
    return NextResponse.json({ message: 'Error updating challenge' }, { status: 500 });
  }
}
