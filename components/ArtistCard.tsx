"use client";

import Image from "next/image";

interface ArtistCardProps {
    name: string;
    image: string;
    spotifyUrl: string;
}

export default function ArtistCard({ name, image, spotifyUrl }: ArtistCardProps) {
    return (
        <a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-neutral-800 rounded-lg p-4 hover:g-neutral-700 transition flex flex-col items-center text-center shadow-md"
        >
            <Image
                src={image}
                alt={name}
                width={160}
                height={160}
                className="w-40 h-40 rounded-full object-cover"
            />
            <h3 className="mt-2 text-while font-semibold truncate w-40">{name}</h3>
        </a>
    );
}