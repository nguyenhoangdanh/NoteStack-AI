import React from 'react';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { PublicOnlyGuard } from '@/components/auth/AuthGuard';

export function RegisterPage() {
  return (
    <PublicOnlyGuard>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </div>
    </PublicOnlyGuard>
  );
}
