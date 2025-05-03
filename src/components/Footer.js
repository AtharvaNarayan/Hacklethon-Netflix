import React from 'react';

const footerLinks = [
  ["FAQ", "Help Center", "Account", "Media Center"],
  ["Investor Relations", "Jobs", "Netflix Shop", "Redeem Gift Cards"],
  ["Buy Gift Cards", "Ways to Watch", "Terms of Use", "Privacy"],
  ["Cookie Preferences", "Corporate Information", "Contact Us", "Speed Test"]
];

function Footer() {
  return (
    <footer className="py-16 px-4 text-gray-400">
      <div className="max-w-6xl mx-auto">
        <p className="mb-6">Questions? Call 1-844-505-2993</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {footerLinks.map((column, columnIndex) => (
            <ul key={columnIndex}>
              {column.map((link, linkIndex) => (
                <li key={linkIndex} className="mb-3">
                  <button 
                    onClick={() => {}} 
                    className="hover:underline text-sm text-left"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          ))}
        </div>

        <div className="mt-8">
          <select className="bg-transparent border rounded px-4 py-1 text-white">
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>

        <p className="mt-6 text-sm">Netflix Clone</p>
      </div>
    </footer>
  );
}

export default Footer; 