import { connectToDB } from "@/utils/database";
import Challenge from "@/models/challenge";
import User from "@/models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET: Eine bestimmte Challenge abrufen
export async function GET(request, { params }) {
  try {
    await connectToDB();

    const { id } = await params;
    const session = await getServerSession(authOptions);

    // Überprüfen, ob der Benutzer authentifiziert ist
    if (!session?.user) {
      return new Response(JSON.stringify({ message: "Nicht autorisiert" }), { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new Response(JSON.stringify({ message: "Benutzer nicht gefunden" }), { status: 404 });
    }

    const challenge = await Challenge.findOne({
      _id: id,
      creator: user._id
    });

    if (!challenge) {
      return new Response(JSON.stringify({ message: "Challenge nicht gefunden" }), { status: 404 });
    }

    return new Response(JSON.stringify(challenge), { status: 200 });
  } catch (error) {
    console.error("Fehler beim Abrufen der Challenge:", error);
    return new Response(JSON.stringify({
      message: "Fehler beim Abrufen der Challenge",
      error: error.message
    }), { status: 500 });
  }
}

// PATCH: Eine Challenge aktualisieren
export async function PATCH(request, { params }) {
  try {
    await connectToDB();

    const { id } = params;
    const updateData = await request.json();
    const session = await getServerSession(authOptions);

    // Überprüfen, ob der Benutzer authentifiziert ist
    if (!session?.user) {
      return new Response(JSON.stringify({ message: "Nicht autorisiert" }), { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new Response(JSON.stringify({ message: "Benutzer nicht gefunden" }), { status: 404 });
    }

    // Sicherstellen, dass die Challenge existiert und dem Benutzer gehört
    const existingChallenge = await Challenge.findOne({
      _id: id,
      creator: user._id
    });

    if (!existingChallenge) {
      return new Response(JSON.stringify({ message: "Challenge nicht gefunden" }), { status: 404 });
    }

    // Aktualisierte Challenge speichern
    const updatedChallenge = await Challenge.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return new Response(JSON.stringify(updatedChallenge), { status: 200 });
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Challenge:", error);
    return new Response(JSON.stringify({
      message: "Fehler beim Aktualisieren der Challenge",
      error: error.message
    }), { status: 500 });
  }
}

// DELETE: Eine Challenge löschen
export async function DELETE(request, { params }) {
  try {
    await connectToDB();

    const { id } = await params;
    const session = await getServerSession(authOptions);

    // Überprüfen, ob der Benutzer authentifiziert ist
    if (!session?.user) {
      return new Response(JSON.stringify({ message: "Nicht autorisiert" }), { status: 401 });
    }

    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return new Response(JSON.stringify({ message: "Benutzer nicht gefunden" }), { status: 404 });
    }

    // Sicherstellen, dass die Challenge existiert und dem Benutzer gehört
    const existingChallenge = await Challenge.findOne({
      _id: id,
      creator: user._id
    });

    if (!existingChallenge) {
      return new Response(JSON.stringify({ message: "Challenge nicht gefunden" }), { status: 404 });
    }

    // Challenge löschen
    await Challenge.findByIdAndDelete(id);

    return new Response(JSON.stringify({ message: "Challenge erfolgreich gelöscht" }), { status: 200 });
  } catch (error) {
    console.error("Fehler beim Löschen der Challenge:", error);
    return new Response(JSON.stringify({ 
      message: "Fehler beim Löschen der Challenge", 
      error: error.message 
    }), { status: 500 });
  }
}