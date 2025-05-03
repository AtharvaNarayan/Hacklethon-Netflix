import React from 'react';

function Header() {
  return (
    <header className="absolute w-full z-50 flex items-center justify-between px-4 py-5 md:px-12">
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
        alt="Netflix"
        className="h-6 md:h-8"
      />
      <div className="flex items-center gap-4">
        <select className="bg-transparent border rounded px-4 py-1 text-white">
          <option value="en">English</option>
          <option value="es">Español</option>
        </select>
        <button className="bg-netflix-red text-white px-4 py-1 rounded font-medium">
          Sign In
        </button>
      </div>
    </header>
  );
}

export default Header; 