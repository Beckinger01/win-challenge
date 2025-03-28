// app/api/challenges/[id]/route.js
import { connectToDB } from '@/utils/database';
import Challenge from '@/models/challenge';
import User from '@/models/user';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { NextResponse } from 'next/server';

// GET a specific challenge
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

// PUT update a challenge
export async function PUT(request, context) {
  const { id } = await context.params;

  try {
    await connectToDB();

    // Autorisierungsprüfung
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: 'Nicht autorisiert' }, { status: 401 });
    }

    const { action, gameIndex, challengeTime, gameTimers, pauseTime, isPauseRunning } = await request.json();

    // Challenge aus der Datenbank holen
    let challenge = await Challenge.findById(id);

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

    // Speichere den aktuellen Timer-Zustand
    if (challengeTime !== undefined && challenge.timer) {
      challenge.timer.duration = challengeTime;
    }

    // Speichere die Game-Timer-Zustände
    if (gameTimers && Array.isArray(gameTimers) && challenge.games) {
      challenge.games.forEach((game, index) => {
        if (gameTimers[index] !== undefined) {
          game.timer.duration = gameTimers[index];
        }
      });
    }

    // Erstelle oder aktualisiere den Pause-Timer
    if (!challenge.pauseTimer) {
      challenge.pauseTimer = {};
    }

    if (pauseTime !== undefined) {
      challenge.pauseTimer.duration = pauseTime;
    }

    if (isPauseRunning !== undefined) {
      challenge.pauseTimer.isRunning = isPauseRunning;
    }

    // Führe die angeforderte Aktion aus
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

          // Pause-Timer stoppen wenn Challenge startet
          if (challenge.pauseTimer) {
            challenge.pauseTimer.isRunning = false;
          }
        }
        break;

      case 'pause-challenge-timer':
        if (challenge.timer.isRunning) {
          const now = new Date();
          challenge.timer.lastPauseTime = now;
          challenge.timer.isRunning = false;
          challenge.paused = true;

          // Pause-Timer starten wenn Challenge pausiert
          if (challenge.pauseTimer) {
            challenge.pauseTimer.isRunning = true;
          }

          // WICHTIG: Alle laufenden Spiel-Timer pausieren
          challenge.games.forEach((game, idx) => {
            if (game.timer.isRunning) {
              game.timer.lastPauseTime = now;
              game.timer.isRunning = false;
              console.log(`Paused game ${idx} due to challenge pause`);
            }
          });
        }
        break;

      case 'stop-challenge-timer':
        if (challenge.timer.startTime) {
          const endTime = new Date();
          const runningTime = endTime - challenge.timer.startTime;
          challenge.timer.endTime = endTime;
          challenge.timer.duration = runningTime - challenge.timer.pausedTime;
          challenge.timer.isRunning = false;
          challenge.completed = true;
          challenge.completedAt = endTime;

          // Pause-Timer stoppen wenn Challenge endet
          if (challenge.pauseTimer) {
            challenge.pauseTimer.isRunning = false;
          }
        }
        break;

      case 'start-game-timer':
        if (gameIndex !== undefined) {
          // First, stop any other running game timers
          for (let i = 0; i < challenge.games.length; i++) {
            if (i !== gameIndex && challenge.games[i].timer.isRunning) {
              const otherGame = challenge.games[i];
              const now = new Date();

              // Calculate duration for the game being stopped
              if (otherGame.timer.startTime) {
                const runningTime = now - otherGame.timer.startTime;
                otherGame.timer.duration = runningTime - otherGame.timer.pausedTime;
              }

              otherGame.timer.lastPauseTime = now;
              otherGame.timer.isRunning = false;

              console.log(`Stopped timer for game ${i} before starting game ${gameIndex}`);
            }
          }

          // Now start the requested game timer
          const game = challenge.games[gameIndex];
          if (game && !game.completed) {
            const now = new Date();

            if (!game.timer.startTime) {
              game.timer.startTime = now;
            } else if (game.timer.lastPauseTime) {
              const pauseDuration = now - game.timer.lastPauseTime;
              game.timer.pausedTime += pauseDuration;
              game.timer.lastPauseTime = null;
            }

            game.timer.isRunning = true;
            console.log(`Started timer for game ${gameIndex}`);
          }
        }
        break;

      case 'pause-game-timer':
        if (gameIndex !== undefined) {
          const game = challenge.games[gameIndex];
          if (game && game.timer.isRunning) {
            game.timer.lastPauseTime = new Date();
            game.timer.isRunning = false;
          }
        }
        break;

      case 'stop-game-timer':
        if (gameIndex !== undefined) {
          const game = challenge.games[gameIndex];
          if (game && game.timer.startTime) {
            const endTime = new Date();
            const runningTime = endTime - game.timer.startTime;
            game.timer.endTime = endTime;
            game.timer.duration = runningTime - game.timer.pausedTime;
            game.timer.isRunning = false;
          }
        }
        break;

      case 'increase-win-count':
        if (gameIndex !== undefined) {
          const game = challenge.games[gameIndex];
          if (game) {
            game.currentWins += 1;

            // Check if game is completed
            if (game.currentWins >= game.winCount) {
              game.completed = true;

              // Stop timer if running
              if (game.timer.isRunning) {
                const now = new Date();
                let totalDuration = 0;

                if (game.timer.startTime) {
                  const runningTime = now - game.timer.startTime;
                  totalDuration = runningTime - game.timer.pausedTime;
                }

                game.timer.endTime = now;
                game.timer.duration = totalDuration;
                game.timer.isRunning = false;
              }
            }

            // Check if all games are completed
            const allCompleted = challenge.games.every(g => g.completed);
            if (allCompleted) {
              challenge.completed = true;
              challenge.completedAt = new Date();

              // Wichtig: Auch den Challenge-Timer stoppen
              if (challenge.timer.isRunning) {
                const endTime = new Date();
                const runningTime = endTime - challenge.timer.startTime;
                challenge.timer.endTime = endTime;
                challenge.timer.duration = runningTime - challenge.timer.pausedTime;
                challenge.timer.isRunning = false;

                console.log("Alle Spiele abgeschlossen - Challenge-Timer automatisch gestoppt");
              }
            }
          }
        }
        break;

      default:
        return NextResponse.json(
          { message: 'Invalid action' },
          { status: 400 }
        );
    }

    // Speichere die Änderungen in der Datenbank
    await challenge.save();

    // Emit socket event if we have a global io instance
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