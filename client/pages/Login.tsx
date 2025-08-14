import React from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { PublicOnlyGuard } from '@/components/auth/AuthGuard';

export function LoginPage() {
  return (
    <PublicOnlyGuard>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </PublicOnlyGuard>
  );
}
