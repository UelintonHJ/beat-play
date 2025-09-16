"use client";

import Image from "next/image";
import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-start pt-35 text-white font-sans">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="relative w-full h-full">
          <Image
            src="/background.png"
            alt="Background"
            fill
            priority
            quality={100}
            className="object-cover"
          />
        </div>
      </div>

      {/* Logo */}
      <div className="flex flex-col items-center gap-6">
        <Image
          src="/logotipo.png"
          alt="Beatplay logo"
          width={320}
          height={320}
          priority
        />
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
