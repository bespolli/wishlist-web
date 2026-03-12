'use client';

import { useState } from 'react';
import { searchArt } from '../lib/api';

export default function ArtSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Full-screen preview modal
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Send search request to backend
  async function handleSearch() {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setSelected(null);
    try {
      const data = await searchArt(q);
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  // Select an image from results to show in small preview
  function handleSelect(imageUrl: string) {
    setSelected(imageUrl);
  }

  // Open full-screen preview modal
  function openPreview(imageUrl: string) {
    setPreviewUrl(imageUrl);
  }

  // Close full-screen preview modal
  function closePreview() {
    setPreviewUrl(null);
  }

  return (
    <div>
      {/* Search bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search images..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className="btn" onClick={handleSearch}>Search</button>
      </div>

      {/* Image grid */}
      <div className="art-grid">
        {loading && <p>Loading...</p>}
        {!loading && results.length === 0 && (
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
            No results yet
          </p>
        )}
        {!loading && results.map((item, index) => (
          <div
            key={index}
            className={`art-item ${selected === item.image ? 'selected' : ''}`}
            onClick={() => handleSelect(item.image)}
          >
            <img src={item.image} alt={item.title || 'Art'} />
          </div>
        ))}
      </div>

      {/* Small preview of selected image — click to open full preview */}
      <div className="img-preview" onClick={() => selected && openPreview(selected)}>
        {selected ? (
          <img src={selected} alt="Preview" style={{ cursor: 'pointer' }} />
        ) : (
          <p>Select an image from the search results</p>
        )}
      </div>

      {/* Full-screen image preview modal */}
      {previewUrl && (
        <div
          className="art-preview-overlay"
          onClick={(e) => {
            // Close when clicking on dark background (not on the image)
            if (e.target === e.currentTarget) closePreview();
          }}
        >
          <div className="art-preview-modal">
            <img src={previewUrl} alt="Full preview" />
            <button className="art-preview-close" onClick={closePreview}>✕</button>
          </div>
        </div>
      )}
    </div>
  );
}
