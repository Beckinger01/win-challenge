// app/api/challenges/[id]/pauseDuration/route.js
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { connectToDB } from "@/utils/database";
import { publishChallengeUpdate } from '@/utils/eventPublisher';
import mongoose from "mongoose";

export async function PUT(request, { params }) {
  try {
    await connectToDB();
    const { id } = params;
    const { pauseDuration } = await request.json();
    
    console.log("PauseDuration-API aufgerufen:", { id, pauseDuration });
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: 'Ungültige Challenge-ID' },
        { status: 400 }
      );
    }
    
    const db = mongoose.connection.db;
    const challengesCollection = db.collection("challenges");
    
    // Update nur für das Pausendauer-Feld
    const result = await challengesCollection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { "pauseDuration": pauseDuration } },
      { returnDocument: 'after' }
    );

    const updatedChallenge = await challengesCollection.findOne({
        _id: new ObjectId(id)
      });
      
      publishChallengeUpdate(id, updatedChallenge);
    
    return NextResponse.json(result.value || result);
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Pausendauer:", error);
    return NextResponse.json(
      { message: 'Serverfehler', error: error.message },
      { status: 500 }
    );
  }
}