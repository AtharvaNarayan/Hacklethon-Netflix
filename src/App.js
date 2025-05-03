import React from 'react';
import HomePage from './components/HomePage';
import WhatsNew from './components/WhatsNew';

function App() {
  return (
    <div className="min-h-screen bg-black text-white font-netflix-sans">
      <HomePage />
      <WhatsNew />
    </div>
  );
}

export default App; 