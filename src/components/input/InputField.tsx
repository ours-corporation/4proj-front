import React from "react";

type InputProps = {
    id: string;
    name?: string;
    label: string;
    value: string;
    type: string;
    required?: boolean;
    onChange: (newValue: string) => void;
    extension?: string;
    disabled?: boolean;
};

export default function InputField({id, name, label, value, type, required, onChange, extension, disabled = false }: InputProps) {
    return (
        <div>
            <label
                className={`block text-sm font-medium ${disabled ? "text-gray-400" : "text-txt-primary dark:text-dark-txt-primary"}`}
                htmlFor={id}
            >
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <div className={`
                mt-1 w-full rounded-md border 
                px-3 py-2
                flex items-center transition-colors duration-200
                ${disabled
                ? "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-75"
                : "bg-input-bg dark:bg-dark-input-bg border-border-subtle dark:border-dark-border-subtle focus-within:ring-2 focus-within:ring-blue-500"
            }
            `}>
                <input
                    id={id}
                    name={name}
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={disabled}
                    className={`
                        flex-grow
                        bg-transparent
                        focus:outline-none
                        p-0 border-none ring-0
                        ${disabled
                        ? "text-gray-500 cursor-not-allowed"
                        : "text-txt-primary dark:text-dark-txt-primary"
                    }
                    `}
                />

                {extension && (
                    <span className={`ml-2 select-none whitespace-nowrap ${disabled ? "text-gray-300" : "text-gray-400"}`}>
                        {extension}
                    </span>
                )}
            </div>
        </div>
    );
}