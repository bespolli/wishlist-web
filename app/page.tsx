'use client';

import { useState } from 'react';
import WishForm from '../components/WishForm';
import WishList from '../components/WishList';
import ArtSearch from '../components/ArtSearch';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <main className="app">
      {/* Left column: wishes */}
      <section className="col">
        <h2>New Wish</h2>
        <WishForm onCreated={() => setRefreshKey((k) => k + 1)} />
        <h2>My Wishes</h2>
        <WishList refreshKey={refreshKey} />
      </section>

      {/* Right column: image search */}
      <section className="col">
        <h2>Image Search</h2>
        <ArtSearch />
      </section>
    </main>
  );
}
