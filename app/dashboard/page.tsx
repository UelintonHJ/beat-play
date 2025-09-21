import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    return (
        <div className="text-white p-8">
            <h1 className="text-2x1 font-bold mb-4">Bem-vindo ao Beatplay</h1>
            {session && (
                <div>
                    <p className="text-gray-300">Logado como <span className="font-semibold">{session.user?.name}</span> {session.user?.name}</p>
                    <img src={session.user?.image || ""} alt="Avatar" className="w-16 h-16"/>
                </div>
            )}
        </div>
    );
}