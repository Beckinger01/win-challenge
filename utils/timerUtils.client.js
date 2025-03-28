// utils/timerUtils.client.js
'use client';

// Format timer display (HH:MM:SS)
export const formatTime = (milliseconds) => {
  if (!milliseconds) return '00:00:00';
  
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ].join(':');
};

// Calculate current timer value
export const getCurrentTimerValue = (timer) => {
  if (!timer || !timer.startTime) return 0;
  
  const now = new Date();
  let elapsed = 0;
  
  if (timer.isRunning) {
    elapsed = now - new Date(timer.startTime) - (timer.pausedTime || 0);
  } else if (timer.endTime) {
    elapsed = timer.duration;
  } else if (timer.lastPauseTime) {
    elapsed = new Date(timer.lastPauseTime) - new Date(timer.startTime) - (timer.pausedTime || 0);
  }
  
  return Math.max(0, elapsed);
};