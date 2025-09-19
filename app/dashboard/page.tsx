import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    return (
        <div className="text-white p-8">
            <h1>🎶 Bem-vindo ao Beatplay</h1>
            {session && (
                <div>
                    <p>Logado como {session.user?.name}</p>
                    <img src={session.user?.image || ""} alt="Avatar" className="w-16 h-16"/>
                </div>
            )}
        </div>
    );
}