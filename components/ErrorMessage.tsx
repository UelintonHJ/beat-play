"use client";

interface ErrorMessageProps {
    message: string;
    className?: string;
    type?: "error" | "offline" | "online" | "unauthenticated" | "sessionExpired" | "apiError";
}

export default function ErrorMessage({ message, type = "error", className }: ErrorMessageProps) {
    const getColor = () => {
        switch (type) {
            case "offline":
                return "bg-yellow-400 text-black rounded-none";
            case "online":
                return "bg-green-400 text-black rounded-none";
            case "unauthenticated":
            case "sessionExpired":
                return "bg-orange-400 text-black rounded-none";
            case "apiError":
                return "bg-red-500 text-white rounded-none";
            case "error":
            default:
                return "bg-red-400 text-black rounded-full px-6";
        }
    };

    return (
        <div className={`flex justify-center items-center border py-2 mx-auto w-fit text-center shadow-sm font-semibold ${getColor()} ${className || ""}`}
        >
            {message}

        </div>
    );
}