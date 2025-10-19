import { connectToDB } from "@/utils/database";
import User from "@/models/user";
import Challenge from "@/models/challenge";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function DELETE(request) {
  try {
    await connectToDB();

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new Response(
        JSON.stringify({ message: "Nicht autorisiert" }),
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return new Response(
        JSON.stringify({ message: "User nicht gefunden" }),
        { status: 404 }
      );
    }

    const deletedChallenges = await Challenge.deleteMany({
      creator: user._id
    });

    console.log(`Gelöschte Challenges: ${deletedChallenges.deletedCount}`);

    await User.findOneAndDelete({ email: userEmail });

    return new Response(
      JSON.stringify({
        message: "Account und alle Daten wurden erfolgreich gelöscht",
        deletedChallenges: deletedChallenges.deletedCount,
        email: userEmail
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Fehler beim Löschen des Users:", error);
    return new Response(
      JSON.stringify({
        message: "Fehler beim Löschen des Users",
        error: error.message
      }),
      { status: 500 }
    );
  }
}