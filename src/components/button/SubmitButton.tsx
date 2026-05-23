import React from "react";

type ButtonProps = {
    id: string;
    type: "button" | "submit" | "reset";
    text: string;
    loading?: boolean;
    loadingText?: string;
    onClick?: () => void;
    className?: string;
};

export default function SubmitButton({ id, type, text, loading, loadingText, onClick, className }: ButtonProps) {
    return (
        <button
            id={id}
            type={type}
            disabled={loading}
            className={className ?? "w-full rounded-md bg-action dark:bg-dark-action py-2 text-white font-medium hover:bg-action-hover dark:hover:bg-dark-action-hover transition disabled:opacity-50"}
            onClick={onClick}
        >
            {loading ? (loadingText || text) : text}
        </button>
    );
}
