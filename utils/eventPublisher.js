// utils/eventPublisher.js
import { notifyChallenge } from '@/app/api/challenges/[id]/events/route';

// Funktion, um Updates an alle Challenge-Beobachter zu senden
export function publishChallengeUpdate(challengeId, challenge) {
  const data = {
    type: 'update',
    timestamp: new Date().toISOString(),
    challenge: challenge
  };
  
  notifyChallenge(challengeId, data);
}