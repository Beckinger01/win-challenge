import { connectToDB } from "@/utils/database";
import User from "@/models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hash, compare } from "bcrypt";

export async function PUT(request) {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new Response(JSON.stringify({ message: "Nicht autorisiert" }), { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return new Response(JSON.stringify({ message: "Aktuelles und neues Passwort sind erforderlich" }), { status: 400 });
    }

    if (newPassword.length < 8) {
      return new Response(JSON.stringify({ message: "Das neue Passwort muss mindestens 8 Zeichen lang sein" }), { status: 400 });
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return new Response(JSON.stringify({ message: "Benutzer nicht gefunden" }), { status: 404 });
    }

    if (!user.password) {
      return new Response(JSON.stringify({ message: "Dieses Konto verwendet Google zur Anmeldung und hat kein Passwort." }), { status: 400 });
    }

    const isPasswordValid = await compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return new Response(JSON.stringify({ message: "Aktuelles Passwort ist falsch" }), { status: 401 });
    }

    const hashedPassword = await hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();

    return new Response(JSON.stringify({ message: "Passwort erfolgreich aktualisiert" }), { status: 200 });
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Passworts:", error);
    return new Response(JSON.stringify({
      message: "Fehler beim Aktualisieren des Passworts",
      error: error.message
    }), { status: 500 });
  }
}