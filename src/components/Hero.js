import React, { useState } from 'react';

function Hero() {
  const [email, setEmail] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);

  const handleGetStarted = (e) => {
    e.preventDefault();
    if (email) {
      setShowRegistration(true);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center text-center">
      <div className="absolute inset-0 bg-[url('https://assets.nflxext.com/ffe/siteui/vlv3/c31c3123-3df7-4359-8b8c-475bd2d9925d/15feb590-b593-4e8f-9e23-5243abec4a67/US-en-20231225-popsignuptwoweeks-perspective_alpha_website_large.jpg')]
        bg-cover bg-center before:absolute before:inset-0 before:bg-black/60" />
      
      <div className="relative max-w-3xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-5">
          Unlimited movies, TV shows, and more
        </h1>
        <p className="text-xl md:text-2xl mb-5">
          Starts at $7.99. Cancel anytime.
        </p>
        <p className="text-lg md:text-xl mb-8">
          Ready to watch? Enter your email to create or restart your membership.
        </p>
        <form onSubmit={handleGetStarted} className="flex flex-col md:flex-row gap-3 max-w-lg mx-auto">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 rounded bg-black/60 border border-gray-600 text-white"
            required
          />
          <button 
            type="submit"
            className="bg-netflix-red text-white px-8 py-3 rounded text-lg md:text-xl font-medium hover:bg-[#f40612] transition-colors"
          >
            Get Started
          </button>
        </form>
      </div>

      {showRegistration && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-black/90 p-8 rounded-lg max-w-md w-full border border-gray-700">
            <h2 className="text-2xl font-bold mb-6">Create your account</h2>
            <form className="space-y-4">
              <div>
                <input
                  type="email"
                  value={email}
                  readOnly
                  className="w-full px-4 py-3 rounded bg-gray-700 text-white border border-gray-600"
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Add a password"
                  className="w-full px-4 py-3 rounded bg-gray-700 text-white border border-gray-600"
                  required
                />
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">
                  I agree to the Netflix Terms of Use and Privacy Statement.
                </label>
              </div>
              <button 
                type="submit"
                className="w-full bg-netflix-red text-white py-3 rounded font-medium hover:bg-[#f40612] transition-colors"
              >
                Create account
              </button>
              <button 
                type="button"
                onClick={() => setShowRegistration(false)}
                className="w-full text-white py-2 text-sm hover:underline"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Hero; 