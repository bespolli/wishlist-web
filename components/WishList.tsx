'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { fetchWishes, updateWish, deleteWish } from '../lib/api';

// Props: external trigger to refresh the list (e.g. after creating a wish)
interface WishListProps {
  refreshKey: number;
}

export default function WishList({ refreshKey }: WishListProps) {
  const { token } = useAuth();

  const [wishes, setWishes] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Load wishes from backend
  const load = useCallback(async () => {
    if (!token) {
      setWishes([]);
      return;
    }
    setLoading(true);

    try {
      const result = await fetchWishes(token, page, search);
      setWishes(result.data);
      setTotalPages(result.meta.totalPages || 1);
    } catch {
      setWishes([]);
    } finally {
      setLoading(false);
    }
  }, [token, page, search]);

  // Reload whenever page, search, token, or refreshKey changes
  useEffect(() => {
    load();
  }, [load, refreshKey]);

  // Edit wish using browser prompt dialogs
  async function handleEdit(id: string, oldTitle: string, oldDescription: string) {
    const newTitle = prompt('New title:', oldTitle);
    if (newTitle === null) return;
    const newDescription = prompt('New description:', oldDescription);
    if (newDescription === null) return;

    try {
      await updateWish(token, id, newTitle, newDescription);
      load();
    } catch (err: any) {
      alert(err.message || 'Failed to update wish');
    }
  }

  // Delete wish after confirmation
  async function handleDelete(id: string) {
    if (!confirm('Delete this wish?')) return;

    try {
      await deleteWish(token, id);
      load();
    } catch (err: any) {
      alert(err.message || 'Failed to delete wish');
    }
  }

  // Apply search and reset to page 1
  function handleSearch() {
    setSearch(searchInput);
    setPage(1);
  }

  // Show prompt if not logged in
  if (!token) {
    return <p>Please log in to see your wishes.</p>;
  }

  return (
    <div>
      {/* Search bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="btn" onClick={handleSearch}>Search</button>
      </div>

      {/* Wish cards */}
      <div className="wishes-list">
        {loading && <p>Loading...</p>}
        {!loading && wishes.length === 0 && <p>No wishes yet. Add a new one!</p>}
        {!loading && wishes.map((wish) => (
          <div key={wish.id} className="wish-card">
            <div className="wish-info">
              <h3>{wish.title}</h3>
              <p>{wish.description || ''}</p>
            </div>
            <div className="wish-actions">
              <button
                className="btn btn-small"
                onClick={() => handleEdit(wish.id, wish.title, wish.description || '')}
              >
                ✏️
              </button>
              <button
                className="btn btn-small btn-danger"
                onClick={() => handleDelete(wish.id)}
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          className="btn btn-ghost"
          onClick={() => setPage((p) => p - 1)}
          disabled={page <= 1}
        >
          ◀ Back
        </button>
        <span id="page-info">Page {page} of {totalPages}</span>
        <button
          className="btn btn-ghost"
          onClick={() => setPage((p) => p + 1)}
          disabled={page >= totalPages}
        >
          Forward ▶
        </button>
      </div>
    </div>
  );
}
