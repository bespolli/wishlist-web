'use client';

import { useState } from 'react';
import AuthBar from '../components/AuthBar';
import AuthModal from '../components/AuthModal';
import WishForm from '../components/WishForm';
import WishList from '../components/WishList';
import ArtSearch from '../components/ArtSearch';

export default function Home() {
  // Controls whether the auth modal is visible
  const [showModal, setShowModal] = useState(false);

  // Incremented after creating a wish — triggers WishList to reload
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      {/* Header with title and auth bar */}
      <header>
        <h1>My Wishlist</h1>
        <AuthBar onOpenModal={() => setShowModal(true)} />
      </header>

      {/* Auth modal — login / register */}
      <AuthModal isOpen={showModal} onClose={() => setShowModal(false)} />

      {/* Main content — two columns */}
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
    </>
  );
}
