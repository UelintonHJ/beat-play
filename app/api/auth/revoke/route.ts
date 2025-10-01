import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.accessToken) {
            return NextResponse.json({ error: "No token found "}, { status: 401 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Erro ao revogar token:", error);
        return NextResponse.json({ error: "Failed to revoke token" }, { status: 500 });
    }
}