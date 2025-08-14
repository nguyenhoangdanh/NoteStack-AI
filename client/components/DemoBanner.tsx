import React from "react";
import { Alert, AlertDescription } from "./ui/alert";
import { Info, Sparkles } from "lucide-react";

export function DemoBanner() {
    const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

    if (!isDemoMode) return null;

    return (
        <Alert className="mb-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
            <div className="flex items-center">
                <Sparkles className="h-4 w-4 text-blue-500 mr-2" />
                <AlertDescription className="text-blue-700 dark:text-blue-300">
                    <strong>Demo Mode:</strong> You're using AI Notes in demo mode. All data is simulated and will not be saved.
                </AlertDescription>
            </div>
        </Alert>
    );
}
