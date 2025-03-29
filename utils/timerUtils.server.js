
import { connectToDB } from '../utils/database';
import Challenge from '../models/challenge';

export const startChallengeTimer = async (challengeId) => {
  try {
    await connectToDB();

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) throw new Error('Challenge not found');

    if (challenge.timer.isRunning) return challenge;

    const now = new Date();

    if (!challenge.timer.startTime) {
      challenge.timer.startTime = now;
    }
    else if (challenge.timer.lastPauseTime) {
      const pauseDuration = now - challenge.timer.lastPauseTime;
      challenge.timer.pausedTime += pauseDuration;
      challenge.timer.lastPauseTime = null;
    }
    challenge.timer.isRunning = true;
    challenge.paused = false;

    await challenge.save();
    return challenge;
  } catch (error) {
    console.error('Error starting challenge timer:', error);
    throw error;
  }
};

export const pauseChallengeTimer = async (challengeId) => {
  try {
    await connectToDB();

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) throw new Error('Challenge not found');

    if (!challenge.timer.isRunning) return challenge;

    challenge.timer.lastPauseTime = new Date();
    challenge.timer.isRunning = false;
    challenge.paused = true;

    await challenge.save();
    return challenge;
  } catch (error) {
    console.error('Error pausing challenge timer:', error);
    throw error;
  }
};

export const stopChallengeTimer = async (challengeId) => {
  try {
    await connectToDB();

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) throw new Error('Challenge not found');

    const now = new Date();
    let totalDuration = 0;

    if (challenge.timer.startTime) {
      const runningTime = now - challenge.timer.startTime;
      totalDuration = runningTime - challenge.timer.pausedTime;
    }

    challenge.timer.endTime = now;
    challenge.timer.duration = totalDuration;
    challenge.timer.isRunning = false;
    challenge.completed = true;
    challenge.completedAt = now;

    await challenge.save();
    return challenge;
  } catch (error) {
    console.error('Error stopping challenge timer:', error);
    throw error;
  }
};

export const startGameTimer = async (challengeId, gameIndex) => {
  try {
    await connectToDB();

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) throw new Error('Challenge not found');

    const game = challenge.games[gameIndex];
    if (!game) throw new Error('Game not found');

    if (game.timer.isRunning) return challenge;

    const now = new Date();

    if (!game.timer.startTime) {
      game.timer.startTime = now;
    }
    else if (game.timer.lastPauseTime) {
      const pauseDuration = now - game.timer.lastPauseTime;
      game.timer.pausedTime += pauseDuration;
      game.timer.lastPauseTime = null;
    }

    game.timer.isRunning = true;

    await challenge.save();
    return challenge;
  } catch (error) {
    console.error('Error starting game timer:', error);
    throw error;
  }
};

export const pauseGameTimer = async (challengeId, gameIndex) => {
  try {
    await connectToDB();

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) throw new Error('Challenge not found');

    const game = challenge.games[gameIndex];
    if (!game) throw new Error('Game not found');

    if (!game.timer.isRunning) return challenge;

    game.timer.lastPauseTime = new Date();
    game.timer.isRunning = false;

    await challenge.save();
    return challenge;
  } catch (error) {
    console.error('Error pausing game timer:', error);
    throw error;
  }
};

export const stopGameTimer = async (challengeId, gameIndex) => {
  try {
    await connectToDB();

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) throw new Error('Challenge not found');

    const game = challenge.games[gameIndex];
    if (!game) throw new Error('Game not found');

    const now = new Date();
    let totalDuration = 0;

    if (game.timer.startTime) {
      const runningTime = now - game.timer.startTime;
      totalDuration = runningTime - game.timer.pausedTime;
    }

    game.timer.endTime = now;
    game.timer.duration = totalDuration;
    game.timer.isRunning = false;



    await challenge.save();
    return challenge;
  } catch (error) {
    console.error('Error stopping game timer:', error);
    throw error;
  }
};

export const increaseWinCount = async (challengeId, gameIndex) => {
  try {
    await connectToDB();

    const challenge = await Challenge.findById(challengeId);
    if (!challenge) throw new Error('Challenge not found');

    const game = challenge.games[gameIndex];
    if (!game) throw new Error('Game not found');

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
    }

    await challenge.save();
    return challenge;
  } catch (error) {
    console.error('Error increasing win count:', error);
    throw error;
  }
};