// src/app/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import NoteForm from '@/components/note-form';
import NoteList from '@/components/note-list';
import { Note } from '@/lib/secret-network';

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/notes');
      const data = await response.json();
      
      if (Array.isArray(data.notes)) {
        setNotes(data.notes);
      } else {
        console.error('Unexpected data structure:', data);
        setNotes([]);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError('Failed to fetch notes. Please try again.');
      setNotes([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (title: string, content: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });
      const result = await response.json();
      if (result.success) {
        // Refresh notes after successful addition
        fetchNotes();
      } else {
        setError('Failed to add note. Please try again.');
        console.error('Failed to add note:', result);
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      console.error('Error adding note:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold">Secret Notes App</h1>
      <NoteForm onSubmit={handleSubmit} />
      <button 
        onClick={fetchNotes} 
        className="bg-green-500 text-white p-2 rounded"
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Refresh Notes'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      <NoteList notes={notes} />
    </div>
  );
}