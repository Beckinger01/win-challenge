// app/api/challenges/[id]/status/route.js
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDB } from "@/utils/database";
import mongoose from "mongoose";

export async function PUT(request, { params }) {
  try {
    await connectToDB();
    const { id } = await params;
    const { status, timestamp = new Date().toISOString(), pauseDuration } = await request.json();
    
    console.log("Status-API aufgerufen:", { id, status, timestamp, pauseDuration });
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Ungültige Challenge-ID' },
        { status: 400 }
      );
    }
    
    const db = mongoose.connection.db;
    const challengesCollection = db.collection("challenges");
    
    // Challenge-Status basierend auf dem übergebenen Status aktualisieren
    const updateFields = {
      // Timer anhalten, wenn der Status nicht "running" ist
      "timer.isRunning": status === "running"
    };
    
    // Erstelle hier separates Objekt für $unset
    const unsetFields = {};
    
    // Status-spezifische Felder setzen
    switch (status) {
      case "completed":
        updateFields.completed = true;
        updateFields.completedAt = timestamp;
        // Pause-Status zurücksetzen, falls gesetzt
        updateFields.paused = false;
        break;
      case "forfeited":
        updateFields.forfeited = true;
        updateFields.forfeitedAt = timestamp;
        // Pause-Status zurücksetzen, falls gesetzt
        updateFields.paused = false;
        break;
      
        case "paused":
          // Neuer Pausiert-Status
          updateFields.paused = true;
          updateFields.pausedAt = timestamp;
          
          // Wenn pauseDuration übergeben wurde, diese verwenden,
          // andernfalls nicht zurücksetzen!
          if (pauseDuration !== undefined) {
            updateFields.pauseDuration = pauseDuration;
          }
          break;
      
      case "resumed":
        // Beim Fortsetzen die Pausenzeit berechnen und speichern
        updateFields.paused = false;
        
        // Wenn pauseDuration übergeben wurde, diese speichern
        if (pauseDuration !== undefined) {
          updateFields.pauseDuration = pauseDuration;
        }
        
        // Feld zum Zurücksetzen in unsetFields verschieben
        unsetFields.pausedAt = "";
        break;
      case "reset":
        // Bei Reset alle Status zurücksetzen
        updateFields.completed = false;
        updateFields.forfeited = false;
        updateFields.paused = false;
        updateFields.pauseDuration = 0;
        
        // Felder zum Zurücksetzen in unsetFields verschieben
        unsetFields.completedAt = "";
        unsetFields.forfeitedAt = "";
        unsetFields.pausedAt = "";
        break;
      case "running":
        // Wenn der Status auf "running" gesetzt wird, alle Status zurücksetzen
        updateFields.completed = false;
        updateFields.forfeited = false;
        updateFields.paused = false;
        break;
    }
    
    // Konstruiere das Update-Objekt korrekt
    const updateQuery = { $set: updateFields };
    
    // $unset nur hinzufügen, wenn es Felder gibt
    if (Object.keys(unsetFields).length > 0) {
      updateQuery.$unset = unsetFields;
    }
    
    // Update in der Datenbank ausführen
    const result = await challengesCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      updateQuery,
      { returnDocument: 'after' }
    );
    
    return NextResponse.json(result.value || result);
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Challenge-Status:", error);
    return NextResponse.json(
      { message: 'Serverfehler', error: error.message },
      { status: 500 }
    );
  }
}