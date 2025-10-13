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

export const getCurrentTimerValue = (timer) => {
  if (!timer) return 0;

  // Basis-Duration (bereits gespeicherte Zeit)
  let totalTime = timer.duration || 0;

  // Wenn der Timer läuft, addiere die aktuelle Session-Zeit
  if (timer.isRunning && timer.startTime) {
    const now = new Date();
    const currentSessionTime = now - new Date(timer.startTime) - (timer.pausedTime || 0);
    totalTime += Math.max(0, currentSessionTime);
  }
  // Wenn der Timer pausiert ist, addiere die Zeit bis zur Pause
  else if (!timer.isRunning && timer.startTime && timer.lastPauseTime && !timer.endTime) {
    const pausedSessionTime = new Date(timer.lastPauseTime) - new Date(timer.startTime) - (timer.pausedTime || 0);
    totalTime += Math.max(0, pausedSessionTime);
  }

  return Math.max(0, totalTime);
};