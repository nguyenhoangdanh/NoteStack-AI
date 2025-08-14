import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "react-hot-toast";

// Page imports
import Index from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";
import Notes from "./pages/Notes";
import NotesDemo from "./pages/NotesDemo";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// New comprehensive page imports
import NotesPage from "./pages/NotesPage";
import CategoriesPage from "./pages/CategoriesPage";
import WorkspacesPage from "./pages/WorkspacesPage";
import SearchPage from "./pages/SearchPage";
import ChatPage from "./pages/ChatPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import TemplatesPage from "./pages/TemplatesPage";
import CollaborationPage from "./pages/CollaborationPage";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function AppContent() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes - all pages are now public for development */}
        <Route path="/" element={<Index />} />
        <Route path="/demo" element={<NotesDemo />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/signup" element={<RegisterPage />} />
        
        {/* Main application routes - now public for development */}
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/workspaces" element={<WorkspacesPage />} />
        <Route path="/search" element={<SearchPage />} />
        
        {/* AI and Advanced Features */}
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/templates" element={<TemplatesPage />} />
        <Route path="/collaboration" element={<CollaborationPage />} />

        {/* Legacy routes for compatibility */}
        <Route path="/ai-chat" element={<ChatPage />} />
        <Route path="/insights" element={<AnalyticsPage />} />
        <Route path="/sharing" element={<CollaborationPage />} />

        {/* 404 route */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--background)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          },
        }}
      />
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
