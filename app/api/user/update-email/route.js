import { connectToDB } from "@/utils/database";
import User from "@/models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { compare } from "bcrypt";

export async function PUT(request) {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return new Response(JSON.stringify({ message: "Nicht autorisiert" }), { status: 401 });
    }

    const { email, currentPassword } = await request.json();

    // E-Mail validieren
    if (!email || !email.includes('@') || !email.includes('.')) {
      return new Response(JSON.stringify({ message: "Ungültige E-Mail-Adresse" }), { status: 400 });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser && existingUser.email !== session.user.email) {
      return new Response(JSON.stringify({ message: "Diese E-Mail wird bereits verwendet" }), { status: 409 });
    }

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return new Response(JSON.stringify({ message: "Benutzer nicht gefunden" }), { status: 404 });
    }

    const isPasswordValid = await compare(currentPassword, user.password);
        if (!isPasswordValid) {
          return new Response(JSON.stringify({ message: "Aktuelles Passwort ist falsch" }), { status: 401 });
    }
    user.email = email;
    await user.save();

    return new Response(JSON.stringify({ message: "E-Mail erfolgreich aktualisiert", email }), { status: 200 });
  } catch (error) {
    console.error("Fehler beim Aktualisieren der E-Mail:", error);
    return new Response(JSON.stringify({ message: "Fehler beim Aktualisieren der E-Mail", error: error.message }), { status: 500 });
  }
}