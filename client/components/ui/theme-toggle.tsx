import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "./button";

export function ThemeToggle() {
    const [theme, setTheme] = React.useState<"light" | "dark">("light");

    React.useEffect(() => {
        // Check for saved theme preference or default to light
        const savedTheme = localStorage.getItem("theme");
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        const initialTheme = (savedTheme as "light" | "dark") || systemTheme;

        setTheme(initialTheme);
        updateTheme(initialTheme);
    }, []);

    const updateTheme = (newTheme: "light" | "dark") => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(newTheme);
        localStorage.setItem("theme", newTheme);
    };

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        updateTheme(newTheme);
    };

    return (
        <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="relative overflow-hidden transition-all duration-300 hover:scale-105 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800 hover:border-blue-300 dark:hover:border-blue-700"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-300 dark:-rotate-90 dark:scale-0 text-orange-500" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-300 dark:rotate-0 dark:scale-100 text-blue-500" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
