import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStatus } from '@/hooks';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ 
  children, 
  fallback, 
  redirectTo = '/login' 
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuthStatus();

  if (isLoading) {
    return fallback || <AuthGuardSkeleton />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

function AuthGuardSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md p-6">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 mx-auto" />
            <Skeleton className="h-3 w-24 mx-auto" />
          </div>
        </div>
      </Card>
    </div>
  );
}

// Reverse guard for public routes (login, register)
export function PublicOnlyGuard({ 
  children, 
  redirectTo = '/notes' 
}: { 
  children: React.ReactNode; 
  redirectTo?: string; 
}) {
  const { isAuthenticated, isLoading } = useAuthStatus();

  if (isLoading) {
    return <AuthGuardSkeleton />;
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
