import React from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { NotesList } from '@/components/notes/NotesList';

export default function NotesPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gradient">Notes</h1>
          <p className="text-muted-foreground">
            Manage all your AI-powered notes in one place. Create, edit, organize, and search through your knowledge base.
          </p>
        </div>

        {/* Notes List */}
        <NotesList />
      </div>
    </DashboardLayout>
  );
}
