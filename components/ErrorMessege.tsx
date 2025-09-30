"use client";

interface ErrorMessageProps {
    message: string;
    className?: string;
}
export default function ErrorMessage({ message, className }: ErrorMessageProps) {
    return (
        <p className={`text-red-500 mt-4 ${className || ""}`}>{message}</p>
    );
}