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

  // FIXED: For running or paused timers, ALWAYS calculate from startTime/pausedTime/lastPauseTime.
  // ONLY use duration if finalized (isRunning=false AND endTime set OR completed).
  // This avoids double-counting if duration was set mid-run (from save-state).
  let totalTime = 0;

  if (timer.isRunning && timer.startTime) {
    // Running: Full elapsed = (now - start) - total paused.
    const now = new Date();
    const runningTime = now - new Date(timer.startTime);
    totalTime = Math.max(0, runningTime - (timer.pausedTime || 0));
  } else if (!timer.isRunning && timer.startTime && timer.lastPauseTime && !timer.endTime) {
    // Paused: Elapsed up to lastPauseTime = (lastPause - start) - total paused (before this pause).
    const pausedAt = new Date(timer.lastPauseTime);
    const runningTime = pausedAt - new Date(timer.startTime);
    totalTime = Math.max(0, runningTime - (timer.pausedTime || 0));
  } else if (!timer.isRunning && timer.endTime) {
    // Finalized/Stopped: Use duration (server-set final value).
    totalTime = timer.duration || 0;
  } else {
    // Not started or other: Use duration as base (e.g., from prior stops).
    totalTime = timer.duration || 0;
  }

  return Math.max(0, totalTime);
};
