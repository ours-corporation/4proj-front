import React from "react";

type InputProps = {
    id: string;
    name?: string;
    label: string;
    value: string;
    type: string;
    required?: boolean;
    onChange: (newValue: string) => void;
};

export default function InputField({ id, name, label, value, type, required, onChange }: InputProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-txt-primary dark:text-dark-txt-primary" htmlFor={id}>
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                id={id}
                name={name}
                type={type}
                required={required}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="
                    mt-1 w-full rounded-md border border-border-subtle dark:border-dark-border-subtle
                    px-3 py-2
                    text-txt-primary dark:text-dark-txt-primary
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                    bg-input-bg dark:bg-dark-input-bg"
            />

        </div>
    );
}

