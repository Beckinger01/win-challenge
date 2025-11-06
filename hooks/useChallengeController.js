'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { getCurrentTimerValue } from '@/utils/timerUtils.client';

export function useChallengeController(id, enabledAuth) {
    const { socket, isConnected } = useSocket(id);

    const [challenge, setChallenge] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);

    const [challengeTime, setChallengeTime] = useState(0);
    const [gameTimers, setGameTimers] = useState([]);
    const [activeGameIndex, setActiveGameIndex] = useState(null);
    const [pendingGameIndex, setPendingGameIndex] = useState(null);

    const [isSwitchingGame, setIsSwitchingGame] = useState(false);
    const [pauseTime, setPauseTime] = useState(0);
    const [isPauseRunning, setIsPauseRunning] = useState(false);
    const [lastSaveTime, setLastSaveTime] = useState(Date.now());

    // Initial: Auth + Challenge
    useEffect(() => {
        let alive = true;
        const run = async () => {
            try {
                if (enabledAuth) {
                    const authRes = await fetch(`/api/challenges/${id}/authorize`);
                    const auth = await authRes.json();
                    if (!alive) return;
                    setIsAuthorized(!!auth.authorized);
                    if (!auth.authorized) {
                        setLoading(false);
                        return;
                    }
                }
                const res = await fetch(`/api/challenges/${id}`, { cache: 'no-store' });
                if (!res.ok) throw new Error('Failed to fetch challenge');
                const data = await res.json();
                if (!alive) return;

                setChallenge(data);
                setChallengeTime(getCurrentTimerValue(data.timer));
                setGameTimers(
                    data.games.map((g) => ({
                        value: getCurrentTimerValue(g.timer),
                        isRunning: !!g.timer?.isRunning,
                    }))
                );
                const activeIdx = data.games.findIndex((g) => g.timer?.isRunning);
                setActiveGameIndex(activeIdx >= 0 ? activeIdx : null);

                if (data.pauseTimer) {
                    let p = data.pauseTimer.duration || 0;
                    if (data.pauseTimer.isRunning && data.pauseTimer.startTime) {
                        p += Date.now() - new Date(data.pauseTimer.startTime).getTime();
                    }
                    setPauseTime(p);
                    setIsPauseRunning(!!data.pauseTimer.isRunning);
                }
                setLoading(false);
                setLastSaveTime(Date.now());
            } catch (e) {
                if (!alive) return;
                setError(e?.message || 'Unknown error');
                setLoading(false);
            }
        };
        run();
        return () => {
            alive = false;
        };
    }, [id, enabledAuth]);

    // Socket: challenge-updated
    useEffect(() => {
        if (!socket) return;
        const onUpdate = (data) => {
            setChallenge(data);
            setChallengeTime(getCurrentTimerValue(data.timer));
            setGameTimers(
                data.games.map((g) => ({
                    value: getCurrentTimerValue(g.timer),
                    isRunning: !!g.timer?.isRunning,
                }))
            );
            const activeIdx = data.games.findIndex((g) => g.timer?.isRunning);
            setActiveGameIndex(activeIdx >= 0 ? activeIdx : null);
            if (data.pauseTimer) {
                setPauseTime(data.pauseTimer.duration || 0);
                setIsPauseRunning(!!data.pauseTimer.isRunning);
            }
        };
        socket.on('challenge-updated', onUpdate);
        return () => socket.off('challenge-updated', onUpdate);
    }, [socket]);

    // Lokaler Tick
    useEffect(() => {
        if (!challenge) return;
        const t = setInterval(() => {
            const now = Date.now();
            if (challenge.timer?.isRunning && !challenge.completed) {
                setChallengeTime((v) => v + 1000);
            }
            setGameTimers((prev) =>
                prev.map((gt, i) => {
                    const g = challenge.games[i];
                    if (gt.isRunning && !g?.completed && !challenge.completed) {
                        return { ...gt, value: gt.value + 1000 };
                    }
                    return gt;
                })
            );
            if (isPauseRunning) setPauseTime((p) => p + 1000);

            const since = now - lastSaveTime;
            const shouldSave = challenge.paused || (!challenge.timer?.isRunning && since >= 300000);
            if (shouldSave && since >= 60000) {
                void saveCurrentState();
                setLastSaveTime(now);
            }
        }, 1000);
        return () => clearInterval(t);
    }, [challenge, isPauseRunning, lastSaveTime]);

    async function updateChallenge(body) {
        if (enabledAuth && !isAuthorized) {
            setError('Nicht berechtigt');
            return null;
        }
        const res = await fetch(`/api/challenges/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error('Failed to update challenge');
        const updated = await res.json();

        setChallenge(updated);
        setGameTimers(
            updated.games.map((g) => ({
                value: getCurrentTimerValue(g.timer),
                isRunning: !!g.timer?.isRunning,
            }))
        );
        setChallengeTime(getCurrentTimerValue(updated.timer));
        setLastSaveTime(Date.now());

        if (socket) socket.emit('update-challenge', { challengeId: id, challengeData: updated });
        return updated;
    }

    async function startChallengeTimer() {
        setIsPauseRunning(false);
        const updated = await updateChallenge({ action: 'start-challenge-timer', pauseTime, isPauseRunning });
        if (updated?.pauseTimer) setPauseTime(updated.pauseTimer.duration || 0);
    }

    async function pauseChallengeTimer() {
        setIsPauseRunning(true);
        return await updateChallenge({ action: 'pause-challenge-timer', pauseTime, isPauseRunning: true });
    }

    async function stopChallengeTimer() {
        setIsPauseRunning(false);
        setGameTimers((prev) => prev.map((t) => ({ ...t, isRunning: false })));
        await updateChallenge({ action: 'forfeited-challenge' });
        setActiveGameIndex(null);
    }

    async function switchToGame(index) {
        if (index === activeGameIndex) return;
        if (challenge?.games[index]?.completed) return;
        if (isSwitchingGame || challenge?.completed || !challenge?.timer?.isRunning) return;

        try {
            setIsSwitchingGame(true);
            setPendingGameIndex(index);
            if (activeGameIndex !== null) {
                await updateChallenge({ action: 'pause-game-timer', gameIndex: activeGameIndex, pauseTime, isPauseRunning });
            }
            const res = await updateChallenge({ action: 'start-game-timer', gameIndex: index, pauseTime, isPauseRunning });
            if (!res) throw new Error('start-game-timer fehlgeschlagen');
            setActiveGameIndex(index);
        } finally {
            setPendingGameIndex(null);
            setTimeout(() => setIsSwitchingGame(false), 300);
        }
    }

    function increaseWinCount(index) {
        void updateChallenge({ action: 'increase-win-count', gameIndex: index });
    }

    async function saveCurrentState() {
        if (!challenge || !navigator.onLine) return;
        const updated = { ...challenge };
        updated.pauseTimer = updated.pauseTimer || {};
        updated.pauseTimer.duration = pauseTime;
        updated.pauseTimer.isRunning = isPauseRunning;
        if (isPauseRunning && !updated.pauseTimer.startTime) {
            updated.pauseTimer.startTime = new Date().toISOString();
        }

        const res = await fetch(`/api/challenges/${id}/save-state`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ challenge: updated }),
        });
        if (!res.ok) return;
        const saved = await res.json();
        setChallenge(saved);
        if (socket) socket.emit('update-challenge', { challengeId: id, challengeData: saved });
        setLastSaveTime(Date.now());
    }

    return {
        challenge,
        loading,
        error,
        isAuthorized,
        isConnected,
        challengeTime,
        gameTimers,
        activeGameIndex,
        pendingGameIndex,
        isSwitchingGame,
        pauseTime,
        isPauseRunning,
        startChallengeTimer,
        pauseChallengeTimer,
        stopChallengeTimer,
        switchToGame,
        increaseWinCount,
        saveCurrentState,
        setIsPauseRunning,
        setPauseTime,
        setError,
    };
}