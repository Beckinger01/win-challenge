// app/api/challenges/[id]/mainTimer/route.js
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDB } from "@/utils/database";
import mongoose from "mongoose";

export async function PUT(request, { params }) {
  try {
    await connectToDB();
    const { id } = await params;
    const { duration } = await request.json();

    console.log("MainTimer-API aufgerufen:", { id, duration });

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Ungültige Challenge-ID' },
        { status: 400 }
      );
    }

    const db = mongoose.connection.db;
    const challengesCollection = db.collection("challenges");

    // Nur den Haupttimer aktualisieren, sonst nichts!
    const result = await challengesCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { "timer.duration": duration } },
      { returnDocument: 'after' }
    );

    return NextResponse.json(result.value || result);
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Haupttimers:", error);
    return NextResponse.json(
      { message: 'Serverfehler', error: error.message },
      { status: 500 }
    );
  }
}