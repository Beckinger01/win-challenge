import { connectToDB } from "@/utils/database";
import Challenge from "@/models/challenge";
import User from "@/models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const POST = async (request) => {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      console.log("Keine Benutzer-Session gefunden");
      return new Response(JSON.stringify({ message: "Nicht autorisiert" }), {
        status: 401
      });
    }

    console.log("Session Benutzer:", session.user);

    if (!session.user.id) {
      console.log("Keine Benutzer-ID in der Session gefunden");
      return new Response(JSON.stringify({
        message: "Benutzer-ID fehlt in der Session"
      }), { status: 400 });
    }

    const challengeData = await request.json();

    console.log("Empfangene Challenge-Daten:", challengeData);

    // Überprüfen der Pflichtfelder
    if (!challengeData.name || !challengeData.games || challengeData.games.length === 0) {
      return new Response(JSON.stringify({
        message: "Fehlende Pflichtfelder"
      }), { status: 400 });
    }

    for (const game of challengeData.games) {
      if (!game.name || !game.winCount) {
        return new Response(JSON.stringify({
          message: "Jedes Spiel muss einen Namen und eine Anzahl Siege haben"
        }), { status: 400 });
      }
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      console.error("Benutzer nicht in der Datenbank gefunden:", session.user.email);
      return new Response(JSON.stringify({
        message: "Benutzer nicht in der Datenbank gefunden"
      }), { status: 404 });
    }

    console.log("Benutzer in DB gefunden:", user._id);

    const newChallenge = new Challenge({
      name: challengeData.name,
      type: challengeData.type || "Classic",
      games: challengeData.games.map(game => ({
        name: game.name,
        winCount: parseInt(game.winCount) || 1,
        currentWins: 0,
        completed: false
      })),
      creator: user._id,
      completed: false,
      createdAt: new Date()
    });

    const savedChallenge = await newChallenge.save();
    console.log("Challenge gespeichert mit ID:", savedChallenge._id);

    return new Response(JSON.stringify(savedChallenge), {
      status: 201
    });

  } catch (error) {
    console.error("Fehler beim Erstellen der Challenge:", error);


    if (error.name === 'ValidationError') {
      const validationErrors = {};

      for (const field in error.errors) {
        validationErrors[field] = error.errors[field].message;
      }

      return new Response(JSON.stringify({
        message: "Validierungsfehler",
        validationErrors: validationErrors,
        error: error.message
      }), { status: 400 });
    }

    if (error.code === 11000) {
      return new Response(JSON.stringify({
        message: "Ein Datensatz mit diesem Namen existiert bereits",
        error: error.message
      }), { status: 409 });
    }

    return new Response(JSON.stringify({
      message: "Fehler beim Erstellen der Challenge",
      error: error.message
    }), { status: 500 });
  }
};

export const GET = async (request) => {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new Response(JSON.stringify({ message: "Nicht autorisiert" }), {
        status: 401
      });
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return new Response(JSON.stringify({
        message: "Benutzer nicht in der Datenbank gefunden"
      }), { status: 404 });
    }

    const challenges = await Challenge.find({ creator: user._id });

    return new Response(JSON.stringify(challenges), {
      status: 200
    });

  } catch (error) {
    console.error("Fehler beim Abrufen der Challenges:", error);
    return new Response(JSON.stringify({
      message: "Fehler beim Abrufen der Challenges",
      error: error.message
    }), { status: 500 });
  }
};