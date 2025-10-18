import { connectToDB } from "@/utils/database";
import User from "@/models/user";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(request) {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new Response(JSON.stringify({ message: "Nicht autorisiert" }), { status: 401 });
    }

    const userEmail = session.user.email;

    const deletedUser = await User.findOneAndDelete({ email: userEmail });

    if (!deletedUser) {
      return new Response(JSON.stringify({ message: "User nicht gefunden" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "User wurde erfolgreich gelöscht", email: userEmail }), { status: 200 });
  } catch (error) {
    console.error("Fehler beim Löschen des Users:", error);
    return new Response(
      JSON.stringify({ message: "Fehler beim Löschen des Users", error: error.message }),
      { status: 500 }
    );
  }
}
