'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { createWish } from '../lib/api';

// Props: callback to refresh wish list after creating a new wish
interface WishFormProps {
  onCreated: () => void;
}

export default function WishForm({ onCreated }: WishFormProps) {
  const { token } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // Handle form submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    try {
      await createWish(token, title, description);
      setTitle('');
      setDescription('');
      onCreated(); // tell parent to refresh the list
    } catch (err: any) {
      setError(err.message || 'Failed to create wish');
    }
  }

  // Only show the form if user is logged in
  if (!token) return null;

  return (
    <form className="wish-form" onSubmit={handleSubmit}>
      <h3>Add a Wish</h3>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit" className="btn">Create</button>
      {error && <p className="form-error">{error}</p>}
    </form>
  );
}
