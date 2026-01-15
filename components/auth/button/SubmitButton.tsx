import React from "react";

type ButtonProps = {
    id: string;
    type: "button" | "submit" | "reset";
    text: string;
    loading?: boolean;
    loadingText?: string;
    onClick?: () => void;
};

export default function InputField({ id, type, text, loading, loadingText, onClick }: ButtonProps) {
    return (
        <button
            id={id}
            type={type}
            disabled={loading}
            className="w-full rounded-md bg-action dark:bg-dark-action dark: py-2 text-white font-medium hover:bg-action-hover dark:hover:bg-dark-action-hover transition disabled:opacity-50"
            onClick={onClick}
        >
            {loading ? (loadingText || text) : text}
        </button>
    );
}
