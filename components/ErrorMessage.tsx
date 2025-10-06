"use client";

interface ErrorMessageProps {
    message: string;
    className?: string;
    type?: "error" | "offline" | "online";
}

export default function ErrorMessage({ message, type = "error", className }: ErrorMessageProps) {
    const getColor = () => {
        switch (type) {
            case "offline":
                return "bg-yellow-400 text-black rounded-none";
            case "online":
                return "bg-green-400 text-black rounded-none";
            default:
                return "bg-red-100 text-red-700 border-xl";
        }
    }

    return (
        <div className={`flex justify-center items-center border py-2 px-4 mx-auto w-fit text-center shadow-sm font-semibold ${getColor()} ${className || ""}`}
        >
            {message}
            
        </div>
    );
}