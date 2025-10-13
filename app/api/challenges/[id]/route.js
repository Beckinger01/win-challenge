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

export async function PUT(request, context) {
  const { id } = await context.params;

  try {
    await connectToDB();

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: 'Nicht autorisiert' }, { status: 401 });
    }

    const { action, gameIndex, challengeTime, gameTimers, pauseTime, isPauseRunning, forfeited } = await request.json();

    let challenge = await Challenge.findById(id);

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
        { message: 'Nur der Ersteller darf die Challenge aktualisieren' },
        { status: 403 }
      );
    }

    // REMOVED: Pre-switch duration updates. These interfere with running timers (e.g., win increments).
    // Instead, handle them INSIDE specific cases (e.g., stop actions) where client sync is needed.
    // Always initialize pauseTimer if missing.
    if (!challenge.pauseTimer) {
      challenge.pauseTimer = {};
    }

    // NEW: Helper function to calculate elapsed time server-side (avoids double-counting).
    // Use this in stop/complete cases instead of adding to existing duration.
    const calculateElapsed = (timer) => {
      if (!timer.startTime || !timer.isRunning) return timer.duration || 0;
      const now = new Date();
      const runningTime = now - new Date(timer.startTime);
      return Math.max(0, runningTime - (timer.pausedTime || 0));
    };

    switch (action) {
      case 'start-challenge-timer':
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
            if (pauseTime !== undefined) {
              challenge.pauseTimer.duration = pauseTime;  // Only set if provided (finalizing pause).
            }
            challenge.pauseTimer.isRunning = false;
            challenge.pauseTimer.startTime = null;
          }
        }
        break;

      case 'stop-all-timers':
        // FIXED: Use destructured vars instead of req.body.
        // Trust client-provided times for stop (as original intent), but only if timer was running.
        // Set duration directly (don't add to existing, to avoid double-count).
        challenge.timer.isRunning = false;
        if (challenge.timer.isRunning || challengeTime !== undefined) {  // Only if stopping or provided.
          challenge.timer.duration = challengeTime !== undefined ? challengeTime : calculateElapsed(challenge.timer);
        }
        challenge.completed = true;

        if (gameTimers && Array.isArray(gameTimers) && challenge.games) {
          challenge.games.forEach((game, index) => {
            game.timer.isRunning = false;
            if (gameTimers[index] !== undefined) {
              game.timer.duration = gameTimers[index];  // Trust client for stop.
            } else if (game.timer.isRunning) {
              game.timer.duration = calculateElapsed(game.timer);  // Fallback to server calc.
            }
            // Clear running state.
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

          if (!challenge.pauseTimer.startTime) {  // Avoid overwriting if already set.
            challenge.pauseTimer.startTime = now;
          }
          challenge.pauseTimer.isRunning = true;
          if (pauseTime !== undefined) {
            challenge.pauseTimer.duration = pauseTime;  // Only if provided.
          }

          // Pause all game timers (no duration set here—let them resume later).
          challenge.games.forEach((game) => {
            if (game.timer.isRunning) {
              game.timer.lastPauseTime = now;
              game.timer.isRunning = false;
            }
          });
        }
        break;

      case 'stop-challenge-timer':
        if (challenge.timer.startTime) {
          const endTime = new Date();
          challenge.timer.endTime = endTime;
          challenge.timer.duration = calculateElapsed(challenge.timer);  // Server calc, no add.
          challenge.timer.isRunning = false;
          challenge.completed = true;
          challenge.completedAt = endTime;
          challenge.timer.startTime = null;  // Clear.
          challenge.timer.pausedTime = 0;
          challenge.timer.lastPauseTime = null;

          if (challenge.pauseTimer) {
            challenge.pauseTimer.isRunning = false;
          }
        }
        break;

      case 'forfied-challenge':  // Typo fix: 'forfeited'?
        challenge.forfeited = true;
        if (challenge.timer.startTime) {
          const endTime = new Date();
          challenge.timer.endTime = endTime;
          challenge.timer.duration = calculateElapsed(challenge.timer);  // Server calc.
          challenge.timer.isRunning = false;
          challenge.completed = true;
          challenge.completedAt = endTime;
          challenge.timer.startTime = null;
          challenge.timer.pausedTime = 0;
          challenge.timer.lastPauseTime = null;

          // Stop all game timers with server calc (consistent with above).
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
          // Stop other running game timers (use server calc for their duration).
          for (let i = 0; i < challenge.games.length; i++) {
            if (i !== gameIndex && challenge.games[i].timer.isRunning) {
              const otherGame = challenge.games[i];
              otherGame.timer.duration = calculateElapsed(otherGame.timer);  // Set final duration.
              otherGame.timer.isRunning = false;
              otherGame.timer.startTime = null;
              otherGame.timer.pausedTime = 0;
              otherGame.timer.lastPauseTime = null;
            }
          }

          // Start new game timer (no duration set—it's running).
          const game = challenge.games[gameIndex];
          if (game && !game.completed) {
            const now = new Date();
            game.timer.startTime = now;
            game.timer.pausedTime = 0;
            game.timer.lastPauseTime = null;
            game.timer.isRunning = true;
          }
        }
        break;

      case 'pause-game-timer':
        if (gameIndex !== undefined) {
          const game = challenge.games[gameIndex];
          if (game && game.timer.isRunning) {
            game.timer.lastPauseTime = new Date();
            game.timer.isRunning = false;
            // No duration set here.
          }
        }
        break;

      case 'stop-game-timer':
        if (gameIndex !== undefined) {
          const game = challenge.games[gameIndex];
          if (game && game.timer.startTime) {
            game.timer.duration = calculateElapsed(game.timer);  // Server calc.
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

            if (game.currentWins >= game.winCount) {
              game.completed = true;

              // FIXED: Use server calc for duration (no pre-set interference, no adding to existing).
              if (game.timer.isRunning && game.timer.startTime) {
                game.timer.duration = calculateElapsed(game.timer);
                game.timer.endTime = new Date();
                game.timer.isRunning = false;
                game.timer.startTime = null;
                game.timer.pausedTime = 0;
                game.timer.lastPauseTime = null;
              }
            }

            // Check if all games completed.
            const allCompleted = challenge.games.every(g => g.completed);
            if (allCompleted) {
              challenge.completed = true;
              challenge.completedAt = new Date();

              if (challenge.timer.isRunning && challenge.timer.startTime) {
                challenge.timer.duration = calculateElapsed(challenge.timer);
                challenge.timer.endTime = new Date();
                challenge.timer.isRunning = false;
                challenge.timer.startTime = null;
                challenge.timer.pausedTime = 0;
                challenge.timer.lastPauseTime = null;
              }
            }
            // NO duration set here unless completing—fixes the jump on increment.
          }
        }
        break;

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
    return NextResponse.json(
      { message: 'Error updating challenge' },
      { status: 500 }
    );
  }
}