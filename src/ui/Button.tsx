import type {ButtonHTMLAttributes} from "react";
import { twMerge } from "tailwind-merge";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
}

export default function Button({ className, children, ...props }: ButtonProps) {
    return (
        <button
            {...props}
            className={twMerge(
                ` 
   cursor-pointer rounded-lg bg-main 
  border-column-bg-main ring-0
   p-4 ring-rose-500 hover:ring-2`,
                className
            )}
        >
            {children}
        </button>
    );
}
