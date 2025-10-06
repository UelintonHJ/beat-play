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
                return "bg-yellow-100 text-yellow-700 border-yellow-400";
            case "online":
                return "bg-green-100 text-green-700 border-green-400";
            default:
                return "bg-red-100 text-red-700 border-red-400";
        }
    }

    return (
        <div className={`flex justify-center items-center border rounded-2xl mt-6 p-4 mx-auto w-fit text-center shadow-sm ${getColor} ${className || ""}`}
        >
            {message}
            
        </div>
    );
}