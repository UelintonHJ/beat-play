"use client";
import { useSession } from "next-auth/react";

export default function Dashboard() {
    const { data: session } = useSession();

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