import React, { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

export default function PageWrapper({ children, title }) {
  useEffect(() => {
    window.scrollTo(0, 0);
    if (title) {
      document.title = `${title} | AutoWash Pro`;
    }
  }, [title]);

  return (
    <div className="min-h-screen font-body text-text-secondary bg-dark-950 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
