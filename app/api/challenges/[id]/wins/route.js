// app/api/challenges/[id]/wins/route.js
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDB } from "@/utils/database";
import { publishChallengeUpdate } from '@/utils/eventPublisher';
import mongoose from "mongoose";

export async function PUT(request, { params }) {
  try {
    await connectToDB();
    const { id } = await params;
    const { gameIndex, action } = await request.json();

    console.log("Wins-API aufgerufen:", { id, gameIndex, action });

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Ungültige Challenge-ID' },
        { status: 400 }
      );
    }

    // Direkter Zugriff auf die Sammlung über Mongoose
    const db = mongoose.connection.db;
    const challengesCollection = db.collection("challenges");

    // Challenge aus der Datenbank abrufen
    const challenge = await challengesCollection.findOne({
      _id: new ObjectId(id)
    });

    if (!challenge) {
      return NextResponse.json(
        { message: 'Challenge nicht gefunden' },
        { status: 404 }
      );
    }

    // Prüfen, ob der Spielindex gültig ist
    if (gameIndex === undefined || gameIndex < 0 || gameIndex >= challenge.games.length) {
      return NextResponse.json(
        { message: 'Ungültiger Spielindex' },
        { status: 400 }
      );
    }

    let updateQuery = {};
    const now = new Date();

    if (action === 'increment') {
      // Siegeszähler erhöhen
      updateQuery = {
        $inc: {
          [`games.${gameIndex}.wins`]: 1
        }
      };

      // Prüfen, ob das Spiel jetzt abgeschlossen ist
      const game = challenge.games[gameIndex];
      const targetWins = game.winCount || game.target; // Je nach Schema
      if ((game.wins || 0) + 1 >= targetWins) {
        updateQuery.$set = {
          [`games.${gameIndex}.completed`]: true,
          [`games.${gameIndex}.completedAt`]: now
        };

        // Prüfen, ob alle Spiele abgeschlossen sind
        const allCompleted = challenge.games.every((g, idx) => {
          if (idx === gameIndex) {
            return true; // Dieses Spiel wird gerade abgeschlossen
          }
          return g.completed;
        });

        if (allCompleted) {
          updateQuery.$set.completed = true;
          updateQuery.$set.completedAt = now;
        }
      }
    } else if (action === 'reset') {
      // Spiel zurücksetzen
      updateQuery = {
        $set: {
          [`games.${gameIndex}.wins`]: 0,
          [`games.${gameIndex}.completed`]: false,
        },
        $unset: {
          [`games.${gameIndex}.completedAt`]: ""
        }
      };

      // Wenn die Challenge als abgeschlossen markiert war, zurücksetzen
      if (challenge.completed) {
        updateQuery.$set.completed = false;
        updateQuery.$unset = updateQuery.$unset || {};
        updateQuery.$unset.completedAt = "";
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

    const updatedChallenge = await challengesCollection.findOne({
      _id: new ObjectId(id)
    });
    
    publishChallengeUpdate(id, updatedChallenge);

    return NextResponse.json(result.value || result);
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Spielsiege:", error);
    return NextResponse.json(
      { message: 'Serverfehler', error: error.message },
      { status: 500 }
    );
  }
}