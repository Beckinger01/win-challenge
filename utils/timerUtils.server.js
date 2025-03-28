// utils/timerUtils.server.js
import { connectToDB } from '../utils/database';
import Challenge from '../models/challenge';

// Start the challenge timer
export const startChallengeTimer = async (challengeId) => {
  try {
    await connectToDB();
    
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) throw new Error('Challenge not found');
    
    // If timer is already running, do nothing
    if (challenge.timer.isRunning) return challenge;
    
    const now = new Date();
    
    // If timer was never started
    if (!challenge.timer.startTime) {
      challenge.timer.startTime = now;
    } 
    // If timer was paused
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

// Pause the challenge timer
export const pauseChallengeTimer = async (challengeId) => {
  try {
    await connectToDB();
    
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) throw new Error('Challenge not found');
    
    // If timer is not running, do nothing
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

// Stop the challenge timer
export const stopChallengeTimer = async (challengeId) => {
  try {
    await connectToDB();
    
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) throw new Error('Challenge not found');
    
    // Calculate final duration
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

// Start a game timer
export const startGameTimer = async (challengeId, gameIndex) => {
  try {
    await connectToDB();
    
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) throw new Error('Challenge not found');
    
    const game = challenge.games[gameIndex];
    if (!game) throw new Error('Game not found');
    
    // If timer is already running, do nothing
    if (game.timer.isRunning) return challenge;
    
    const now = new Date();
    
    // If timer was never started
    if (!game.timer.startTime) {
      game.timer.startTime = now;
    } 
    // If timer was paused
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

// Pause a game timer
export const pauseGameTimer = async (challengeId, gameIndex) => {
  try {
    await connectToDB();
    
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) throw new Error('Challenge not found');
    
    const game = challenge.games[gameIndex];
    if (!game) throw new Error('Game not found');
    
    // If timer is not running, do nothing
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

// Stop a game timer
export const stopGameTimer = async (challengeId, gameIndex) => {
  try {
    await connectToDB();
    
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) throw new Error('Challenge not found');
    
    const game = challenge.games[gameIndex];
    if (!game) throw new Error('Game not found');
    
    // Calculate final duration
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

// Increase win count for a game
export const increaseWinCount = async (challengeId, gameIndex) => {
  try {
    await connectToDB();
    
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) throw new Error('Challenge not found');
    
    const game = challenge.games[gameIndex];
    if (!game) throw new Error('Game not found');
    
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
    }
    
    await challenge.save();
    return challenge;
  } catch (error) {
    console.error('Error increasing win count:', error);
    throw error;
  }
};