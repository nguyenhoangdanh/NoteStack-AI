import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "./components/ui/toaster";
import { useConvexAuth } from "convex/react";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notes from "./pages/Notes";
import SetupRequired from "./components/SetupRequired";
import { Loader2 } from "lucide-react";

// Initialize Convex client
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL || "");

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Public Route wrapper (redirects to notes if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/notes" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route 
          path="/" 
          element={
            <PublicRoute>
              <Index />
            </PublicRoute>
          } 
        />
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />
        
        {/* Protected routes */}
        <Route 
          path="/notes" 
          element={
            <ProtectedRoute>
              <Notes />
            </ProtectedRoute>
          } 
        />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default function App() {
  const convexUrl = import.meta.env.VITE_CONVEX_URL;
  const isConfigured = convexUrl && !convexUrl.includes("your-project");

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {!isConfigured ? (
        <SetupRequired />
      ) : (
        <ConvexProvider client={convex}>
          <ConvexAuthProvider>
            <AppContent />
          </ConvexAuthProvider>
        </ConvexProvider>
      )}
    </ThemeProvider>
  );
}
