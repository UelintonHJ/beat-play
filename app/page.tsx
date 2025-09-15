"use client";

import Image from "next/image"; 
import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white font-sans"> 
      {/* Logo */}
      <div className="flex flex-col items-center gap-6">
        <Image
          src="/logo.svg" //colocar depois logo real
          alt="Beatplay logo"
          width={120}
          height={120}
          priority
        />
        <h1 className="text-3xl font-bold tracking-tight">Beatplay</h1> 
        <p className="text-gray-400 text-center max-w-sm">
          Entre com sua conta Spotify para começar a descobrir músicas de um jeito novo.
        </p>

        {/* Botão de login */}
        <button
          onClick={() => signIn("spotify", { callbackUrl: "/dashboard" })}
          className="mt-6 flex items-center gap-3 bg-green-500 hover:bg-green-600 text-black font-semibold px-6 py-3 rounded-full shadow-lg transition"
        >
          <Image
            src="/spotify.svg"
            alt="Spotify logo"
            width={24}
            height={24}
          />
          Entrar com Spotify
        </button>
      </div>
    </main>
  );
}
