"use client";

import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Home, Music, User, Settings } from "lucide-react";

interface SidebarProps {
    user?: {
        name?: string | null;
        image?: string | null;
    };
}

export default function Sidebar({ user }: SidebarProps) {
    const handleLogout = async () => {
        await signOut({
            redirect: true,
            callbackUrl: "/"
        });
    };

    return (
        <aside className="h-screen w-64 bg-black/80 text-gray-200 flex flex-col justify-between p-6">
            {/* Topo: Logo + Navegação */}
            <div>
                {/* Logo */}
                <div className="flex items-center justify-center mb-10">
                    <Image
                        src="/logotipo.png"
                        alt="Beatplay logo"
                        width={170}
                        height={40}
                        priority
                    />
                </div>

                {/* Links de navegação */}
                <nav className="flex flex-col gap-4">
                    <Link href="/dashboard" className="flex items-center gap-3 hover:text-green-300 transition">
                        <Home size={20} /> Home
                    </Link>
                    <Link href="/dashboard/playlists" className="flex items-center gap-3 hover:text-green-300 transition">
                        <Music size={20} /> Playlists
                    </Link>
                    <Link href="/dashboard/artistas" className="flex items-center gap-3 hover:text-green-300 transition">
                        <User size={20} /> Artistas
                    </Link>
                    <Link href="/dashboard/configuracoes" className="flex items-center gap-3 hover:text-green-300 transition">
                        <Settings size={20} /> Configurações
                    </Link>
                </nav>
            </div>

            {/* Rodapé: Avatar + Logout */}
            <div className="flex items-center gap-3 px-4">
                {user?.image && (
                    <Image 
                        src={user.image}
                        alt={user.name || "Avatar"}
                        width={45}
                        height={40}
                        className="rounded-full"
                    />
                )}
                <div className="flex flex-col items-center">
                    <span className="text-sm font-semibold">{user?.name}</span>
                    <button
                        onClick={handleLogout}
                        className="inline-block w-10 mt-2 text-xs bg-red-500 hover:bg-red-700 text-white-300 px-1 py-1 rounded-full transition cursor-pointer"
                    >
                        Sair
                    </button>
                </div>
            </div>
        </aside>
    );
}