import { connectToDB } from "@/utils/database";
import User from "@/models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PUT(request) {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new Response(JSON.stringify({ message: "Nicht autorisiert" }), { status: 401 });
    }

    const { username } = await request.json();

    if (!username || username.trim() === "") {
      return new Response(JSON.stringify({ message: "Benutzername darf nicht leer sein" }), { status: 400 });
    }

    const usernameRegex = /^(?=.{4,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![._])$/;

    if (!usernameRegex.test(username)) {

      let errorMessage = "Ungültiger Benutzername. ";

      if (username.length < 4 || username.length > 20) {
        errorMessage += "Der Benutzername muss zwischen 4 und 20 Zeichen lang sein. ";
      }

      if (username.startsWith('.') || username.startsWith('_')) {
        errorMessage += "Der Benutzername darf nicht mit einem Punkt oder Unterstrich beginnen. ";
      }

      if (username.endsWith('.') || username.endsWith('_')) {
        errorMessage += "Der Benutzername darf nicht mit einem Punkt oder Unterstrich enden. ";
      }

      if (/[^a-zA-Z0-9._]/.test(username)) {
        errorMessage += "Der Benutzername darf nur Buchstaben, Zahlen, Punkte und Unterstriche enthalten. ";
      }

      if (/[_.]{2}/.test(username)) {
        errorMessage += "Der Benutzername darf keine zwei Punkte oder Unterstriche hintereinander enthalten. ";
      }

      return new Response(JSON.stringify({
        message: errorMessage.trim(),
        validationError: true
      }), { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return new Response(JSON.stringify({ message: "Benutzer nicht gefunden" }), { status: 404 });
    }

    const existingUser = await User.findOne({ username: username });
    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
      return new Response(JSON.stringify({
        message: "Dieser Benutzername ist bereits vergeben",
        validationError: true
      }), { status: 409 });
    }

    const previousUsername = user.username;
    user.username = username;

    try {
      await user.save();

      return new Response(JSON.stringify({
        message: "Benutzername erfolgreich aktualisiert",
        oldUsername: previousUsername,
        newUsername: username
      }), { status: 200 });
    } catch (saveError) {

      if (saveError.name === 'ValidationError') {
        return new Response(JSON.stringify({
          message: saveError.message || "Validierungsfehler beim Speichern des Benutzernamens",
          validationError: true
        }), { status: 400 });
      }
      throw saveError;
    }

  } catch (error) {
    console.error("Fehler beim Aktualisieren des Benutzernamens:", error);
    return new Response(JSON.stringify({
      message: "Fehler beim Aktualisieren des Benutzernamens",
      error: error.message
    }), { status: 500 });
  }
}