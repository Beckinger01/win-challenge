// app/api/challenges/[id]/timer/route.js
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDB } from "@/utils/database";
import { publishChallengeUpdate } from '@/utils/eventPublisher';
import mongoose from "mongoose";

export async function PUT(request, { params }) {
  try {
    await connectToDB();
    const { id } = await params;
    const { action, gameIndex } = await request.json();
    
    console.log("Timer-API aufgerufen:", { id, action, gameIndex });
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Ungültige Challenge-ID' },
        { status: 400 }
      );
    }
    
    const db = mongoose.connection.db;
    const challengesCollection = db.collection("challenges");
    
    const challenge = await challengesCollection.findOne({
      _id: new ObjectId(id)
    });
    
    if (!challenge) {
      return NextResponse.json(
        { message: 'Challenge nicht gefunden' },
        { status: 404 }
      );
    }
    
    const now = new Date();
    let updateQuery = {};
    
    if (action === 'start') {
      // Haupttimer starten
      updateQuery = {
        $set: {
          "timer.isRunning": true,
          "timer.startTime": now
        }
      };
      
      // Wenn ein spezifisches Spiel gestartet werden soll
      if (gameIndex !== undefined) {
        const gameKey = `games.${gameIndex}.timer`;
        updateQuery.$set[`${gameKey}.isRunning`] = true;
        updateQuery.$set[`${gameKey}.startTime`] = now;
      }
    } else if (action === 'stop') {
      // Berechne die verstrichene Zeit seit dem Start
      let additionalDuration = 0;
      
      if (challenge.timer?.isRunning && challenge.timer?.startTime) {
        additionalDuration = now - new Date(challenge.timer.startTime);
      }
      
      let totalDuration = (challenge.timer?.duration || 0) + additionalDuration;
      
      // Haupttimer stoppen
      updateQuery = {
        $set: {
          "timer.isRunning": false,
          "timer.duration": totalDuration,
          "timer.endTime": now
        },
        $unset: {
          "timer.startTime": ""
        }
      };
      
      // Wenn ein spezifisches Spiel gestoppt werden soll
      if (gameIndex !== undefined) {
        const gameKey = `games.${gameIndex}.timer`;
        const gameTimer = challenge.games[gameIndex]?.timer || {};
        
        let gameAdditionalDuration = 0;
        if (gameTimer.isRunning && gameTimer.startTime) {
          gameAdditionalDuration = now - new Date(gameTimer.startTime);
        }
        
        let gameTotalDuration = (gameTimer.duration || 0) + gameAdditionalDuration;
        
        updateQuery.$set[`${gameKey}.isRunning`] = false;
        updateQuery.$set[`${gameKey}.duration`] = gameTotalDuration;
        updateQuery.$set[`${gameKey}.endTime`] = now;
        
        if (!updateQuery.$unset) {
          updateQuery.$unset = {};
        }
        updateQuery.$unset[`${gameKey}.startTime`] = "";
      }
    } else {
      return NextResponse.json(
        { message: 'Ungültige Aktion' },
        { status: 400 }
      );
    }
    
    // Logging für Debugging
    console.log("Update Query:", JSON.stringify(updateQuery, null, 2));
    
    // Update in der Datenbank ausführen
    const result = await challengesCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      updateQuery,
      { returnDocument: 'after' }
    );
    
    // Logge das Ergebnis
    console.log("Timer Update Ergebnis:", result.value ? "Erfolgreich" : "Fehlgeschlagen");

    const updatedChallenge = await challengesCollection.findOne({
      _id: new ObjectId(id)
    });

    publishChallengeUpdate(id, updatedChallenge);
    
    return NextResponse.json(result.value || result);
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Challenge-Timers:", error);
    return NextResponse.json(
      { message: 'Serverfehler', error: error.message },
      { status: 500 }
    );
  }
}