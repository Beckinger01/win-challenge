// app/api/challenges/[id]/timer/route.js
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDB } from "@/utils/database";
import mongoose from "mongoose";

export async function PUT(request, { params }) {
  try {
    await connectToDB();
    // WICHTIG: Kein 'await' bei params - es ist bereits ein Objekt
    const { id } = await params;
    const { action, gameIndex, duration } = await request.json();

    console.log("Timer-API aufgerufen:", { id, action, gameIndex, duration });

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Ungültige Challenge-ID' },
        { status: 400 }
      );
    }

    // Direkter Zugriff auf die Sammlung über Mongoose
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
          "timer.lastStarted": now
        }
      };

      // Wenn ein spezifisches Spiel gestartet werden soll
      if (gameIndex !== undefined) {
        const gameKey = `games.${gameIndex}.timer`;
        updateQuery.$set[`${gameKey}.isRunning`] = true;
        updateQuery.$set[`${gameKey}.lastStarted`] = now;
      }
    } else if (action === 'stop') {
      let mainDuration = duration;

      // Fallback: berechne die verstrichene Zeit
      if (mainDuration === undefined && challenge.timer && challenge.timer.lastStarted) {
        mainDuration = now - new Date(challenge.timer.lastStarted);
      }

      // Fallback: verwende den aktuellen Wert
      if (mainDuration === undefined) {
        mainDuration = challenge.timer?.duration || 0;
      }

      // Haupttimer stoppen
      updateQuery = {
        $set: {
          "timer.isRunning": false,
          // EXPLIZIT den übergebenen oder berechneten Wert setzen
          "timer.duration": mainDuration
        },
        $unset: {
          "timer.lastStarted": ""
        }
      };

      // Wenn ein spezifisches Spiel gestoppt werden soll
      if (gameIndex !== undefined) {
        const gameKey = `games.${gameIndex}.timer`;
        let gameDuration = duration;

        // Fallback: Berechnung wenn keine Dauer angegeben
        if (gameDuration === undefined) {
          const gameTimer = challenge.games[gameIndex]?.timer || {};
          if (gameTimer && gameTimer.lastStarted) {
            gameDuration = now - new Date(gameTimer.lastStarted);
          } else {
            gameDuration = gameTimer.duration || 0;
          }
        }

        updateQuery.$set[`${gameKey}.isRunning`] = false;
        updateQuery.$set[`${gameKey}.duration`] = gameDuration;
        updateQuery.$unset[`${gameKey}.lastStarted`] = "";
      }
    } else {
      return NextResponse.json(
        { message: 'Ungültige Aktion' },
        { status: 400 }
      );
    }

    // Update in der Datenbank ausführen
    const result = await challengesCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      updateQuery,
      { returnDocument: 'after' }
    );

    return NextResponse.json(result.value || result);
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Challenge-Timers:", error);
    return NextResponse.json(
      { message: 'Serverfehler', error: error.message },
      { status: 500 }
    );
  }
}