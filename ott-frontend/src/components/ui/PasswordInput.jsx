import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./Input";

export function PasswordInput({ className = "", ...props }) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        type={isVisible ? "text" : "password"}
        className={["pr-12", className].filter(Boolean).join(" ")}
      />
      <button
        type="button"
        className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-md text-text-muted transition-colors duration-[140ms] ease-out hover:text-text focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-focus"
        onClick={() => setIsVisible((current) => !current)}
        aria-label={isVisible ? "Hide password" : "Show password"}
        aria-pressed={isVisible}
      >
        {isVisible ? (
          <EyeOff className="size-5" aria-hidden="true" />
        ) : (
          <Eye className="size-5" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
