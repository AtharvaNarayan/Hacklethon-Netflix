import React, { useState } from 'react';

const faqs = [
  {
    question: "What is Netflix?",
    answer: "Netflix is a streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices. You can watch as much as you want, whenever you want – all for one low monthly price. There's always something new to discover and new TV shows and movies are added every week!"
  },
  {
    question: "How much does Netflix cost?",
    answer: "Watch Netflix on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed monthly fee. Plans range from $7.99 to $24.99 a month (pre-tax). No extra costs, no contracts."
  },
  {
    question: "Where can I watch?",
    answer: "Watch anywhere, anytime. Sign in with your Netflix account to watch instantly on the web at netflix.com from your personal computer or on any internet-connected device that offers the Netflix app, including smart TVs, smartphones, tablets, streaming media players and game consoles."
  },
  {
    question: "How do I cancel?",
    answer: "Netflix is flexible. There are no pesky contracts and no commitments. You can easily cancel your account online in two clicks. There are no cancellation fees – start or stop your account anytime."
  },
  {
    question: "What can I watch on Netflix?",
    answer: "Netflix has an extensive library of feature films, documentaries, TV shows, anime, award-winning Netflix originals, and more. Watch as much as you want, anytime you want."
  }
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [email, setEmail] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleGetStarted = (e) => {
    e.preventDefault();
    if (email) {
      setShowRegistration(true);
    }
  };

  return (
    <div className="py-12 px-4">
      <h2 className="text-3xl md:text-5xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h2>
      <div className="max-w-4xl mx-auto">
        {faqs.map((faq, index) => (
          <div key={index} className="mb-2">
            <button
              className="w-full bg-netflix-gray p-6 text-left text-lg md:text-2xl flex justify-between items-center"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <span className={`transform transition-transform duration-200 ${openIndex === index ? 'rotate-45' : ''}`}>
                +
              </span>
            </button>
            {openIndex === index && (
              <div className="bg-netflix-gray mt-px p-6 text-lg md:text-xl">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="text-center mt-12">
        <p className="text-lg md:text-xl mb-4">
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
                <input type="checkbox" id="terms-faq" required />
                <label htmlFor="terms-faq">
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

export default FAQ; 