"use client";

import Image from "next/image";

interface PlaylistCardProps {
    name: string;
    owner: string;
    image: string;
    spotifyUrl: string;
}

export default function PlaylistCard({ name, owner, image, spotifyUrl }: PlaylistCardProps) {
    return (
        <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-neutral-800 rounded-lg p-4 hover:bg-neutral-700 transition flex flex-col items-center text-center shadow-md" 
        >
            <Image 
                src={image}
                alt={name}
                width={160}
                height={160}
                className="rounded-lg mb-3"
            />
            <h3 className="text-white font-semibold truncate w-40">{name}</h3>
            <p className="text-gray-400 text-sm truncate w-40">por {owner}</p>
        </a>
    );
}