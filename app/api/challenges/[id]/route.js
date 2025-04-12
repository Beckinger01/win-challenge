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

    if (challengeTime !== undefined && challenge.timer) {
      challenge.timer.duration = challengeTime;
    }

    if (gameTimers && Array.isArray(gameTimers) && challenge.games) {
      challenge.games.forEach((game, index) => {
        if (gameTimers[index] !== undefined) {
          game.timer.duration = gameTimers[index];
        }
      });
    }

    if (!challenge.pauseTimer) {
      challenge.pauseTimer = {};
    }

    if (pauseTime !== undefined) {
      challenge.pauseTimer.duration = pauseTime;
    }

    if (isPauseRunning !== undefined) {
      challenge.pauseTimer.isRunning = isPauseRunning;
    }

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

          if (challenge.pauseTimer) {
            challenge.pauseTimer.isRunning = false;
          }
        }
        break;

      case 'stop-all-timers':
        challenge.timer.isRunning = false;
        challenge.timer.duration = req.body.challengeTime || challenge.timer.duration;
        challenge.completed = true;

        challenge.games.forEach((game, index) => {
          game.timer.isRunning = false;
          if (req.body.gameTimers && req.body.gameTimers[index] !== undefined) {
            game.timer.duration = req.body.gameTimers[index];
          }
        });

        if (challenge.pauseTimer) {
          challenge.pauseTimer.isRunning = false;
          challenge.pauseTimer.duration = req.body.pauseTime || challenge.pauseTimer.duration;
        }

        await challenge.save();
        break;

      case 'pause-challenge-timer':
        if (challenge.timer.isRunning) {
          const now = new Date();
          challenge.timer.lastPauseTime = now;
          challenge.timer.isRunning = false;
          challenge.paused = true;

          if (challenge.pauseTimer) {
            challenge.pauseTimer.isRunning = true;
          }
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

          if (challenge.pauseTimer) {
            challenge.pauseTimer.isRunning = false;
          }
        }
        break;

      case 'forfied-challenge':
        challenge.forfeited = true;
        if (challenge.timer.startTime) {
          const endTime = new Date();
          const runningTime = endTime - challenge.timer.startTime;
          challenge.timer.endTime = endTime;
          challenge.timer.duration = runningTime - challenge.timer.pausedTime;
          challenge.timer.isRunning = false;
          challenge.completed = true;
          challenge.completedAt = endTime;

          // Stoppe alle Game-Timer
          challenge.games.forEach((game) => {
            if (game.timer.isRunning) {
              game.timer.isRunning = false;

              // Falls der Game-Timer eine Startzeit hatte, berechne und setze die Dauer
              if (game.timer.startTime) {
                const gameRunningTime = endTime - game.timer.startTime;
                game.timer.endTime = endTime;
                game.timer.duration = gameRunningTime - game.timer.pausedTime;
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
          for (let i = 0; i < challenge.games.length; i++) {
            if (i !== gameIndex && challenge.games[i].timer.isRunning) {
              const otherGame = challenge.games[i];
              const now = new Date();

              if (otherGame.timer.startTime) {
                const runningTime = now - otherGame.timer.startTime;
                otherGame.timer.duration = runningTime - otherGame.timer.pausedTime;
              }

              otherGame.timer.lastPauseTime = now;
              otherGame.timer.isRunning = false;

              console.log(`Stopped timer for game ${i} before starting game ${gameIndex}`);
            }
          }
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
            if (game.currentWins >= game.winCount) {
              game.completed = true;

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

            const allCompleted = challenge.games.every(g => g.completed);
            if (allCompleted) {
              challenge.completed = true;
              challenge.completedAt = new Date();

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