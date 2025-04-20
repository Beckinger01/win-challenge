import { connectToDB } from "@/utils/database";
import Bug from "@/models/bug";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const POST = async (req) => {
    try {
        await connectToDB();

        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response(JSON.stringify({ message: "Not authenticated" }), { status: 401 });
        }

        const { title, message } = await req.json();

        if (!title || !message) {
            return new Response(JSON.stringify({ message: "Title and message are required" }), { status: 400 });
        }

        const newBug = new Bug({
            title,
            message,
            userId: session.user.id,
            username: session.user.username || session.user.email
        });

        await newBug.save();

        return new Response(JSON.stringify(newBug), { status: 201 });
    } catch (error) {
        console.error("Error submitting bug:", error);
        return new Response(JSON.stringify({ message: "Failed to submit bug report" }), { status: 500 });
    }
};