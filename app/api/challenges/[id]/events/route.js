// app/api/challenges/[id]/events/route.js
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDB } from "@/utils/database";
import mongoose from "mongoose";

// Globales Objekt, um Controller für alle aktiven Verbindungen zu speichern
// In einer Produktionsumgebung solltest du Redis oder einen ähnlichen Service für Skalierbarkeit verwenden
const challengeSubscribers = {};

// Hilfs-Funktion, um alle Beobachter einer Challenge zu benachrichtigen
export function notifyChallenge(challengeId, data) {
  const subscribers = challengeSubscribers[challengeId] || [];
  
  subscribers.forEach(controller => {
    try {
      const encodedData = new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`);
      controller.enqueue(encodedData);
    } catch (error) {
      console.error(`Fehler beim Senden an Subscriber für Challenge ${challengeId}:`, error);
    }
  });
}

export async function GET(request, { params }) {
  try {
    await connectToDB();
    const { id } = await params;
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Ungültige Challenge-ID' },
        { status: 400 }
      );
    }
    
    const db = mongoose.connection.db;
    const challengesCollection = db.collection("challenges");
    
    // Prüfen, ob Challenge existiert
    const challenge = await challengesCollection.findOne({
      _id: new ObjectId(id)
    });
    
    if (!challenge) {
      return NextResponse.json(
        { message: 'Challenge nicht gefunden' },
        { status: 404 }
      );
    }
    
    // Stream und Encoder erstellen
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        // Controller speichern
        if (!challengeSubscribers[id]) {
          challengeSubscribers[id] = [];
        }
        challengeSubscribers[id].push(controller);
        
        // Verbindung bestätigen
        const initialData = {
          type: 'connected',
          timestamp: new Date().toISOString(),
          message: `Verbunden mit Challenge ${id}`
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(initialData)}\n\n`));
        
        // Initiale Challenge-Daten senden
        const challengeData = {
          type: 'update',
          timestamp: new Date().toISOString(),
          challenge: challenge
        };
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(challengeData)}\n\n`));
        
        // Heartbeat alle 30 Sekunden, um die Verbindung aufrechtzuerhalten
        const heartbeatInterval = setInterval(() => {
          const heartbeat = {
            type: 'heartbeat',
            timestamp: new Date().toISOString()
          };
          try {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify(heartbeat)}\n\n`));
          } catch (error) {
            // Wenn ein Fehler auftritt, Interval beenden und Controller entfernen
            clearInterval(heartbeatInterval);
            if (challengeSubscribers[id]) {
              const index = challengeSubscribers[id].indexOf(controller);
              if (index !== -1) {
                challengeSubscribers[id].splice(index, 1);
              }
            }
          }
        }, 30000);
      },
      cancel() {
        // Bereinigen, wenn der Client die Verbindung schließt
        if (challengeSubscribers[id]) {
          const index = challengeSubscribers[id].indexOf(controller);
          if (index !== -1) {
            challengeSubscribers[id].splice(index, 1);
          }
        }
      }
    });
    
    // Stream als Response zurückgeben
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive'
      }
    });
  } catch (error) {
    console.error("Fehler bei Event-Stream:", error);
    return NextResponse.json(
      { message: 'Serverfehler', error: error.message },
      { status: 500 }
    );
  }
}