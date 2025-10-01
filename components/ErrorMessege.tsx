"use client";

interface ErrorMessageProps {
    message: string;
    className?: string;
}
export default function ErrorMessage({ message, className }: ErrorMessageProps) {
    return (
        <p className={`flex justify-center text-red-500 bg-black-300 rounded-full mt-4 p-6 ${className || ""}`}>{message}</p>
    );
}