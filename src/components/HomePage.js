import React, { useState, useEffect, useRef } from 'react';
import WatchTogether from './WatchTogether';

// Add cinematic animations
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  @keyframes gradientMove {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }

  .cinematic-hover {
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .cinematic-hover:hover {
    transform: scale(1.05);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.9);
  }

  .movie-card {
    animation: scaleIn 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .title-fade-in {
    animation: fadeInUp 0.8s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .gradient-text {
    background: linear-gradient(90deg, #ff0000, #ff4d4d, #ff0000);
    background-size: 200% auto;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: gradientMove 3s linear infinite;
  }

  .cinematic-blur {
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }

  .movie-shine {
    position: relative;
    overflow: hidden;
  }

  .movie-shine::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
    transform: rotate(45deg);
    transition: all 0.3s;
    opacity: 0;
  }

  .movie-shine:hover::after {
    opacity: 1;
    transform: rotate(45deg) translate(50%, 50%);
  }
`;
document.head.appendChild(style);

// Add theme configurations
const themes = {
  netflix: {
    name: 'Netflix',
    icon: '🔴',
    styles: {
      background: 'from-black via-[#141414] to-black',
      primary: 'text-netflix-red',
      secondary: 'text-white',
      accent: 'from-red-600 to-purple-600',
      card: 'bg-[#181818]',
      hover: 'hover:bg-white/10',
      button: 'bg-netflix-red hover:bg-netflix-red/80',
      modal: 'bg-[#181818]'
    }
  },
  midnight: {
    name: 'Midnight Blue',
    icon: '🌌',
    styles: {
      background: 'from-blue-900 via-[#0a192f] to-blue-900',
      primary: 'text-blue-400',
      secondary: 'text-blue-100',
      accent: 'from-blue-400 to-purple-500',
      card: 'bg-[#0a192f]',
      hover: 'hover:bg-blue-400/10',
      button: 'bg-blue-500 hover:bg-blue-600',
      modal: 'bg-[#0a192f]'
    }
  },
  emerald: {
    name: 'Emerald',
    icon: '🌿',
    styles: {
      background: 'from-green-900 via-[#064e3b] to-green-900',
      primary: 'text-emerald-400',
      secondary: 'text-emerald-100',
      accent: 'from-emerald-400 to-teal-500',
      card: 'bg-[#064e3b]',
      hover: 'hover:bg-emerald-400/10',
      button: 'bg-emerald-500 hover:bg-emerald-600',
      modal: 'bg-[#064e3b]'
    }
  },
  sunset: {
    name: 'Sunset',
    icon: '🌅',
    styles: {
      background: 'from-orange-900 via-[#7c2d12] to-orange-900',
      primary: 'text-orange-400',
      secondary: 'text-orange-100',
      accent: 'from-orange-400 to-pink-500',
      card: 'bg-[#7c2d12]',
      hover: 'hover:bg-orange-400/10',
      button: 'bg-orange-500 hover:bg-orange-600',
      modal: 'bg-[#7c2d12]'
    }
  },
  cyberpunk: {
    name: 'Cyberpunk',
    icon: '🌐',
    styles: {
      background: 'from-purple-900 via-[#2d1b69] to-purple-900',
      primary: 'text-purple-400',
      secondary: 'text-purple-100',
      accent: 'from-purple-400 to-pink-500',
      card: 'bg-[#2d1b69]',
      hover: 'hover:bg-purple-400/10',
      button: 'bg-purple-500 hover:bg-purple-600',
      modal: 'bg-[#2d1b69]'
    }
  }
};

const categories = [
  {
    title: "Shop Movies",
    movies: [
      { 
        id: 31, 
        title: "The Adventure Collection", 
        image: "https://picsum.photos/400/600?random=31",
        thumbnailVideo: "https://assets.mixkit.co/videos/preview/mixkit-mountain-climber-reaching-the-mountain-peak-4150-large.mp4",
        description: "Experience the thrill of adventure with this stunning collection. Includes behind-the-scenes footage and director's commentary.",
        duration: "2h 35m",
        rating: "PG-13",
        releaseYear: 2023
      },
      { 
        id: 32, 
        title: "Mystery Island Trilogy", 
        image: "https://picsum.photos/400/600?random=32",
        thumbnailVideo: "https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-5016-large.mp4",
        description: "Uncover the secrets of Mystery Island in this thrilling trilogy. Includes all three movies and exclusive bonus content.",
        duration: "5h 45m",
        rating: "PG-13",
        releaseYear: 2023
      },
      { 
        id: 33, 
        title: "The Dark Night Series", 
        image: "https://picsum.photos/400/600?random=33",
        thumbnailVideo: "https://assets.mixkit.co/videos/preview/mixkit-city-lights-at-night-1-large.mp4",
        description: "Dive into the darkness with this gripping series. Features extended cuts and alternate endings.",
        duration: "4h 15m",
        rating: "R",
        releaseYear: 2022
      },
      { 
        id: 34, 
        title: "Ocean's Mystery Box Set", 
        image: "https://picsum.photos/400/600?random=34",
        thumbnailVideo: "https://assets.mixkit.co/videos/preview/mixkit-scuba-diver-swimming-underwater-4172-large.mp4",
        description: "Explore the depths of the ocean with this comprehensive box set. Includes documentary features and marine life guides.",
        duration: "3h 20m",
        rating: "PG",
        releaseYear: 2023
      },
      { 
        id: 35, 
        title: "Mountain Peak Collection", 
        image: "https://picsum.photos/400/600?random=35",
        thumbnailVideo: "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-mountains-covered-with-snow-4785-large.mp4",
        description: "Reach new heights with this breathtaking collection. Features stunning aerial photography and climber interviews.",
        duration: "2h 55m",
        rating: "PG-13",
        releaseYear: 2023
      },
      { 
        id: 36, 
        title: "City Lights Special Edition", 
        image: "https://picsum.photos/400/600?random=36",
        thumbnailVideo: "https://assets.mixkit.co/videos/preview/mixkit-time-lapse-of-a-city-at-night-4177-large.mp4",
        description: "Experience the city that never sleeps in this special edition release. Includes night photography tutorials and city guides.",
        duration: "1h 45m",
        rating: "PG",
        releaseYear: 2023
      }
    ]
  },
  {
    title: "Trending Now",
    movies: [
      { 
        id: 1, 
        title: "The Adventure", 
        image: "https://picsum.photos/400/600?random=1",
        thumbnailVideo: "https://assets.mixkit.co/videos/preview/mixkit-person-walking-on-a-path-on-the-mountain-4809-large.mp4"
      },
      { 
        id: 2, 
        title: "Mystery Island", 
        image: "https://picsum.photos/400/600?random=2",
        thumbnailVideo: "https://assets.mixkit.co/videos/preview/mixkit-palm-tree-in-the-wind-1181-large.mp4"
      },
      { 
        id: 3, 
        title: "The Dark Night", 
        image: "https://picsum.photos/400/600?random=3",
        thumbnailVideo: "https://assets.mixkit.co/videos/preview/mixkit-full-moon-in-the-dark-sky-4405-large.mp4"
      },
      { 
        id: 4, 
        title: "Ocean's Mystery", 
        image: "https://picsum.photos/400/600?random=4",
        thumbnailVideo: "https://assets.mixkit.co/videos/preview/mixkit-white-sand-beach-and-palm-trees-1564-large.mp4"
      },
      { 
        id: 13, 
        title: "Mountain Peak", 
        image: "https://picsum.photos/400/600?random=5",
        thumbnailVideo: "https://assets.mixkit.co/videos/preview/mixkit-aerial-panorama-of-a-landscape-with-mountains-4798-large.mp4"
      },
      { 
        id: 14, 
        title: "City Lights", 
        image: "https://picsum.photos/400/600?random=6",
        thumbnailVideo: "https://assets.mixkit.co/videos/preview/mixkit-traffic-on-a-rainy-night-4331-large.mp4"
      }
    ]
  },
  {
    title: "Popular Shows",
    movies: [
      { id: 5, title: "Desert Storm", image: "https://picsum.photos/400/600?random=7" },
      { id: 6, title: "Forest Tales", image: "https://picsum.photos/400/600?random=8" },
      { id: 7, title: "Sky High", image: "https://picsum.photos/400/600?random=9" },
      { id: 8, title: "Urban Legend", image: "https://picsum.photos/400/600?random=10" },
      { id: 15, title: "River Run", image: "https://picsum.photos/400/600?random=11" },
      { id: 16, title: "Time Loop", image: "https://picsum.photos/400/600?random=12" }
    ]
  },
  {
    title: "New Releases",
    movies: [
      { id: 9, title: "Space Journey", image: "https://picsum.photos/400/600?random=13" },
      { id: 10, title: "Deep Blue", image: "https://picsum.photos/400/600?random=14" },
      { id: 11, title: "Wild West", image: "https://picsum.photos/400/600?random=15" },
      { id: 12, title: "Arctic Tale", image: "https://picsum.photos/400/600?random=16" },
      { id: 17, title: "Desert Mirage", image: "https://picsum.photos/400/600?random=17" },
      { id: 18, title: "Mountain Echo", image: "https://picsum.photos/400/600?random=18" }
    ]
  },
  {
    title: "Award Winners",
    movies: [
      { id: 19, title: "Sunset Dreams", image: "https://picsum.photos/400/600?random=19" },
      { id: 20, title: "City Shadows", image: "https://picsum.photos/400/600?random=20" },
      { id: 21, title: "Ocean Depths", image: "https://picsum.photos/400/600?random=21" },
      { id: 22, title: "Forest Whispers", image: "https://picsum.photos/400/600?random=22" },
      { id: 23, title: "Mountain Call", image: "https://picsum.photos/400/600?random=23" },
      { id: 24, title: "River Song", image: "https://picsum.photos/400/600?random=24" }
    ]
  },
  {
    title: "Action & Adventure",
    movies: [
      { id: 25, title: "Desert Wind", image: "https://picsum.photos/400/600?random=25" },
      { id: 26, title: "Ice Storm", image: "https://picsum.photos/400/600?random=26" },
      { id: 27, title: "Jungle Quest", image: "https://picsum.photos/400/600?random=27" },
      { id: 28, title: "Urban Chase", image: "https://picsum.photos/400/600?random=28" },
      { id: 29, title: "Mountain Peak", image: "https://picsum.photos/400/600?random=29" },
      { id: 30, title: "Ocean's Call", image: "https://picsum.photos/400/600?random=30" }
    ]
  }
];

function HomePage() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [hoveredMovie, setHoveredMovie] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [watchTogetherMovie, setWatchTogetherMovie] = useState(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Browse');
  const [myList, setMyList] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [currentTheme, setCurrentTheme] = useState('netflix');
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const themeMenuRef = useRef(null);
  const cartRef = useRef(null);
  const [isWatching, setIsWatching] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const videoRef = useRef(null);
  const [previewVideoRefs] = useState({});

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('movieflix-theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Save theme changes
  useEffect(() => {
    localStorage.setItem('movieflix-theme', currentTheme);
  }, [currentTheme]);

  // Handle click outside theme menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
        setIsThemeMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Add styles for video preview animation
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes videoFadeIn {
        from {
          opacity: 0;
          transform: scale(1.1);
        }
        to {
          opacity: 1;
          transform: scale(1);
        }
      }

      .video-preview {
        animation: videoFadeIn 0.3s ease-out forwards;
      }

      .video-container {
        position: relative;
        overflow: hidden;
      }

      .video-container::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 40%;
        background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
        pointer-events: none;
      }

      .video-container video {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const theme = themes[currentTheme];

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setIsSelectOpen(false);
  };

  const addToMyList = (movie) => {
    if (!myList.some(item => item.id === movie.id)) {
      setMyList([...myList, movie]);
    }
  };

  const removeFromMyList = (movieId) => {
    setMyList(myList.filter(movie => movie.id !== movieId));
  };

  const isInMyList = (movieId) => {
    return myList.some(movie => movie.id === movieId);
  };

  const addToCart = (movie) => {
    setCart([...cart, { ...movie, quantity: 1 }]);
  };

  const removeFromCart = (movieId) => {
    setCart(cart.filter(item => item.id !== movieId));
  };

  const updateQuantity = (movieId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(cart.map(item => 
      item.id === movieId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    // Here you would typically integrate with a payment processor like Stripe
    alert('Proceeding to checkout...');
  };

  const isInCart = (movieId) => {
    return cart.some(item => item.id === movieId);
  };

  // Filter categories based on selected category
  const getFilteredCategories = () => {
    switch (selectedCategory) {
      case 'Shop':
        return categories.filter(cat => cat.title === "Shop Movies");
      case 'Movies':
        return categories.filter(cat => 
          !cat.title.toLowerCase().includes('tv') && 
          !cat.title.toLowerCase().includes('series')
        );
      case 'TV Shows':
        return categories.filter(cat => 
          cat.title.toLowerCase().includes('tv') || 
          cat.title.toLowerCase().includes('series')
        );
      case 'New & Popular':
        return categories.filter(cat => 
          cat.title.includes('New') || 
          cat.title.includes('Trending') || 
          cat.title.includes('Popular')
        );
      case 'My List':
        return [{
          title: 'My List',
          movies: myList
        }];
      default:
        return categories;
    }
  };

  const handleMovieClick = (movie) => {
    setIsClosing(false);
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setIsClosing(true);
    // Wait for animation to complete before removing modal
    setTimeout(() => {
      setSelectedMovie(null);
      setIsClosing(false);
    }, 400); // Match this with the bounceOut animation duration
  };

  const startWatchTogether = (movie) => {
    setWatchTogetherMovie(movie);
  };

  const startWatching = (movie) => {
    setCurrentlyPlaying(movie);
    setIsWatching(true);
  };

  const stopWatching = () => {
    setIsWatching(false);
    setCurrentlyPlaying(null);
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleMouseEnter = (movie, videoRef) => {
    setHoveredMovie(movie);
    if (videoRef && videoRef.current) {
      // Reset video to start and ensure it only plays for 3 seconds
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => {
        // Set timeout to restart video after 3 seconds
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.currentTime = 0;
          }
        }, 3000);
      }).catch(() => {
        console.log('Autoplay prevented');
      });
    }
  };

  const handleMouseLeave = (videoRef) => {
    setHoveredMovie(null);
    if (videoRef && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${theme.styles.background} transition-colors duration-500`}>
      {/* Navigation */}
      <nav className={`fixed w-full z-50 bg-gradient-to-b from-black/95 via-black/70 to-transparent px-6 py-4 cinematic-blur`}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className={`${theme.styles.primary} gradient-text`}>
            <svg 
              viewBox="0 0 111 30" 
              className="h-8 w-24 fill-current transform hover:scale-105 transition-transform duration-300" 
              aria-hidden="true" 
              focusable="false"
            >
              <path d="M105.06233,14.2806261 L110.999156,30 C109.249227,29.7497422 107.500234,29.4366857 105.718437,29.1554972 L102.374168,20.4686475 L98.9371075,28.4375293 C97.2499766,28.1563408 95.5928391,28.061674 93.9057081,27.8432843 L99.9372012,14.0931671 L94.4680851,-5.68434189e-14 L99.5313525,-5.68434189e-14 L102.593495,7.87421502 L105.874965,-5.68434189e-14 L110.999156,-5.68434189e-14 L105.06233,14.2806261 Z M90.4686475,-5.68434189e-14 L85.8749649,-5.68434189e-14 L85.8749649,27.2499766 C87.3746368,27.3437061 88.9371075,27.4055675 90.4686475,27.5930265 L90.4686475,-5.68434189e-14 Z M81.9055207,26.93692 C77.7186241,26.6557316 73.5307901,26.4064111 69.250164,26.3117443 L69.250164,-5.68434189e-14 L73.9366389,-5.68434189e-14 L73.9366389,21.8745899 C76.6248008,21.9373887 79.3120255,22.1557784 81.9055207,22.2804387 L81.9055207,26.93692 Z M64.2496954,10.6561065 L64.2496954,15.3435186 L57.8442216,15.3435186 L57.8442216,25.9996251 L53.2186709,25.9996251 L53.2186709,-5.68434189e-14 L66.3436123,-5.68434189e-14 L66.3436123,4.68741213 L57.8442216,4.68741213 L57.8442216,10.6561065 L64.2496954,10.6561065 Z M45.3435186,4.68741213 L45.3435186,26.2498828 C43.7810479,26.2498828 42.1876465,26.2498828 40.6561065,26.3117443 L40.6561065,4.68741213 L35.8121661,4.68741213 L35.8121661,-5.68434189e-14 L50.2183897,-5.68434189e-14 L50.2183897,4.68741213 L45.3435186,4.68741213 Z M30.749836,15.5928391 C28.687787,15.5928391 26.2498828,15.5928391 24.4999531,15.6875059 L24.4999531,22.6562939 C27.2499766,22.4678976 30,22.2495079 32.7809542,22.1557784 L32.7809542,26.6557316 L19.812541,27.6876933 L19.812541,-5.68434189e-14 L32.7809542,-5.68434189e-14 L32.7809542,4.68741213 L24.4999531,4.68741213 L24.4999531,10.9991564 C26.3126816,10.9991564 29.0936358,10.9054269 30.749836,10.9054269 L30.749836,15.5928391 Z M4.78114163,12.9684132 L4.78114163,29.3429562 C3.09401069,29.5313525 1.59340144,29.7497422 0,30 L0,-5.68434189e-14 L4.4690224,-5.68434189e-14 L10.562377,17.0315868 L10.562377,-5.68434189e-14 L15.2497891,-5.68434189e-14 L15.2497891,28.061674 C13.5935889,28.3437998 11.906458,28.4375293 10.1246602,28.6868498 L4.78114163,12.9684132 Z"></path>
            </svg>
          </div>
          <div className="flex items-center gap-6">
            {/* Theme Switcher */}
            <div className="relative" ref={themeMenuRef}>
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className={`group flex items-center gap-2 bg-black/40 ${theme.styles.hover} text-white px-4 py-2 rounded-full border border-white/10 hover:border-white/30 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-white/20 cinematic-blur`}
              >
                <span>{theme.icon}</span>
                <span className="text-sm font-medium">{theme.name}</span>
              </button>

              {/* Theme Menu */}
              {isThemeMenuOpen && (
                <div 
                  className="absolute top-full right-0 mt-2 w-48 bg-black/95 cinematic-blur rounded-lg border border-white/10 shadow-2xl transform opacity-0 scale-95 animate-in"
                >
                  <div className="py-1">
                    {Object.entries(themes).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => {
                          setCurrentTheme(key);
                          setIsThemeMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm transition-all duration-300 flex items-center gap-2
                          ${currentTheme === key ? `${theme.styles.primary} bg-white/5 font-medium` : 'text-white/90 hover:text-white'} ${theme.styles.hover}`}
                      >
                        <span>{value.icon}</span>
                        {value.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart Button */}
            <div className="relative" ref={cartRef}>
              <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className={`group flex items-center gap-2 bg-black/40 ${theme.styles.hover} text-white px-4 py-2 rounded-full border border-white/10 hover:border-white/30 transition-all duration-500`}
              >
                <span>🛒</span>
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>

              {/* Shopping Cart Menu */}
              {isCartOpen && (
                <div className="absolute top-full right-0 mt-2 w-96 bg-black/95 cinematic-blur rounded-lg border border-white/10 shadow-2xl transform opacity-0 scale-95 animate-in">
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-4">Shopping Cart</h3>
                    {cart.length === 0 ? (
                      <p className="text-gray-400">Your cart is empty</p>
                    ) : (
                      <>
                        <div className="space-y-4 max-h-96 overflow-y-auto">
                          {cart.map(item => (
                            <div key={item.id} className="flex items-center gap-4 bg-white/5 p-4 rounded-lg">
                              <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded" />
                              <div className="flex-1">
                                <h4 className="font-medium">{item.title}</h4>
                                <p className="text-sm text-gray-400">{item.format}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <button 
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    className="text-white/70 hover:text-white"
                                  >-</button>
                                  <span>{item.quantity}</span>
                                  <button 
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    className="text-white/70 hover:text-white"
                                  >+</button>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                                <button 
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-red-500 text-sm hover:text-red-400"
                                >Remove</button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-white/10 mt-4 pt-4">
                          <div className="flex justify-between mb-4">
                            <span>Total:</span>
                            <span className="font-bold">${getTotalPrice().toFixed(2)}</span>
                          </div>
                          <button
                            onClick={handleCheckout}
                            className={`w-full ${theme.styles.button} text-white py-3 rounded-lg font-medium`}
                          >
                            Proceed to Checkout
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsSelectOpen(!isSelectOpen)}
                className="group flex items-center gap-3 bg-black/40 hover:bg-black/60 text-white px-6 py-2.5 rounded-full border border-white/10 hover:border-white/30 transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-white/20 cinematic-blur"
              >
                <span className="text-sm font-medium">{selectedCategory}</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-500 ${isSelectOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown menu */}
              {isSelectOpen && (
                <div 
                  className="absolute top-full mt-2 w-48 bg-black/95 cinematic-blur rounded-lg border border-white/10 shadow-2xl transform opacity-0 scale-95 animate-in"
                >
                  <div className="py-1">
                    {['Browse', 'Movies', 'TV Shows', 'New & Popular', 'My List', 'Shop'].map((item) => (
                      <button
                        key={item}
                        onClick={() => handleCategorySelect(item)}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition-all duration-300 flex items-center gap-2
                          ${selectedCategory === item ? `${theme.styles.primary} bg-white/5 font-medium` : 'text-white/90 hover:text-white'}`}
                      >
                        {item === 'Movies' && <span>🎬</span>}
                        {item === 'TV Shows' && <span>📺</span>}
                        {item === 'New & Popular' && <span>🔥</span>}
                        {item === 'My List' && <span>❤️</span>}
                        {item === 'Browse' && <span>🔍</span>}
                        {item === 'Shop' && <span>🛍️</span>}
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${theme.styles.accent} flex items-center justify-center text-white cursor-pointer hover:scale-105 transition-all duration-300 shadow-lg`}>
              U
            </div>
          </div>
        </div>
      </nav>

      {/* Add styles for dropdown animation */}
      <style jsx>{`
        @keyframes dropdownIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        
        .animate-in {
          animation: dropdownIn 0.2s ease-out forwards;
        }
      `}</style>

      {/* Update document title */}
      <script>
        document.title = 'Netflix - Watch TV Shows Online, Watch Movies Online';
      </script>

      {/* Featured Content */}
      <div className="relative pt-[56.25%] bg-black">
        <div className="absolute inset-0">
          <img
            src="https://picsum.photos/1920/1080?random=main"
            alt="Featured"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 p-12 max-w-2xl title-fade-in">
            <h1 className={`text-6xl md:text-7xl font-bold mb-6 leading-tight ${theme.styles.secondary} drop-shadow-2xl`}>
              The Adventure
            </h1>
            <p className="text-xl mb-8 text-gray-200 leading-relaxed">
              An epic journey through uncharted territories, where mystery and excitement await at every turn. Join our heroes as they embark on the adventure of a lifetime.
            </p>
            <div className="flex gap-6">
              <button className={`${theme.styles.button} text-white px-8 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center gap-3 text-lg shadow-xl`}>
                <span>▶</span> Play
              </button>
              <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 flex items-center gap-3 text-lg cinematic-blur">
                <span>ℹ</span> More Info
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Categories */}
      <div className="relative z-10 -mt-40 pb-20">
        {getFilteredCategories().map((category, index) => (
          <div key={index} className="mb-16 title-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
            <h2 className={`text-2xl md:text-3xl font-bold mb-6 px-6 ${theme.styles.secondary}`}>
              {category.title}
            </h2>
            <div className="relative group">
              <div className="flex overflow-x-auto space-x-4 scrollbar-hide px-6">
                {category.movies.map((movie, movieIndex) => {
                  // Create a new video ref for each movie if it doesn't exist
                  if (!previewVideoRefs[movie.id]) {
                    previewVideoRefs[movie.id] = React.createRef();
                  }
                  const videoRef = previewVideoRefs[movie.id];

                  return (
                    <div 
                      key={movie.id} 
                      className="flex-none w-[240px] movie-card movie-shine"
                      style={{ animationDelay: `${movieIndex * 0.1}s` }}
                      onMouseEnter={() => handleMouseEnter(movie, videoRef)}
                      onMouseLeave={() => handleMouseLeave(videoRef)}
                      onClick={() => handleMovieClick(movie)}
                    >
                      <div className={`relative overflow-hidden rounded-lg cursor-pointer cinematic-hover ${theme.styles.card}`}>
                        <div className="video-container h-[360px]">
                          <img
                            src={movie.image}
                            alt={movie.title}
                            className={`w-full h-full object-cover transition-opacity duration-300 ${
                              hoveredMovie?.id === movie.id ? 'opacity-0' : 'opacity-100'
                            }`}
                          />
                          {movie.thumbnailVideo && (
                            <video
                              ref={videoRef}
                              className={`absolute inset-0 w-full h-full object-cover video-preview transition-opacity duration-300 ${
                                hoveredMovie?.id === movie.id ? 'opacity-100' : 'opacity-0'
                              }`}
                              src={movie.thumbnailVideo}
                              muted
                              playsInline
                              loop
                            >
                              Your browser does not support the video tag.
                            </video>
                          )}
                        </div>
                        
                        {hoveredMovie?.id === movie.id && (
                          <div 
                            className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-500"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex flex-col gap-3 mb-4">
                              <div className="flex gap-2">
                                <button 
                                  className="flex-1 py-3 bg-white text-black rounded-lg font-bold hover:bg-white/90 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMovieClick(movie);
                                  }}
                                >
                                  ▶ Play
                                </button>
                                <button 
                                  className="flex-1 py-3 bg-white/20 text-white rounded-lg font-bold hover:bg-white/30 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    startWatchTogether(movie);
                                  }}
                                >
                                  👥 Watch Together
                                </button>
                              </div>
                              {movie.price && (
                                hoveredMovie.inStock ? (
                                  <button 
                                    className="w-full py-3 bg-white/20 text-white rounded-lg font-bold hover:bg-white/30 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center justify-center gap-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      isInCart(hoveredMovie.id) ? setIsCartOpen(true) : addToCart(hoveredMovie);
                                    }}
                                  >
                                    {isInCart(hoveredMovie.id) ? (
                                      <>✓ In Cart</>
                                    ) : (
                                      <>🛒 Add to Cart - ${hoveredMovie.price}</>
                                    )}
                                  </button>
                                ) : (
                                  <button 
                                    className="w-full py-3 bg-gray-600 text-white/70 rounded-lg font-bold cursor-not-allowed"
                                    disabled
                                  >
                                    Out of Stock
                                  </button>
                                )
                              )}
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <span className="text-white/70">{hoveredMovie.format || 'HD'}</span>
                                <span className="text-white/70">{hoveredMovie.format}</span>
                                <span className="text-white/70">•</span>
                                <span className="text-white/70">{hoveredMovie.duration}</span>
                                <span className="text-white/70">•</span>
                                <span className="text-white/70">{hoveredMovie.rating}</span>
                              </div>
                              <div className="flex flex-wrap gap-2 text-xs">
                                <span className="px-2 py-1 bg-white/10 rounded-full text-white/70">Physical Copy</span>
                                <span className="px-2 py-1 bg-white/10 rounded-full text-white/70">Collector's Edition</span>
                                <span className="px-2 py-1 bg-white/10 rounded-full text-white/70">{hoveredMovie.releaseYear}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="mt-4 px-1">
                        <h3 className="text-lg font-semibold text-white/90 group-hover:text-white transition-colors">{movie.title}</h3>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Movie Modal */}
      {selectedMovie && (
        <div 
          className={`fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-6 ${
            isClosing ? 'animate-fadeOut' : 'overlay-fade-in'
          }`}
          onClick={handleCloseModal}
        >
          <div 
            className={`${theme.styles.modal} rounded-xl max-w-5xl w-full overflow-hidden shadow-2xl ${
              isClosing ? 'modal-bounce-out' : 'modal-bounce-in'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={selectedMovie.image}
                alt={selectedMovie.title}
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-black/50" />
              <button
                onClick={handleCloseModal}
                className="absolute top-6 right-6 bg-black/60 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-black/80 transition-all transform hover:scale-105 cinematic-blur"
              >
                ✕
              </button>
              <div className="absolute bottom-0 left-0 p-12">
                <h2 className="text-5xl font-bold mb-6">{selectedMovie.title}</h2>
                <div className="flex gap-6">
                  <button className={`${theme.styles.button} text-white px-10 py-4 rounded-lg font-bold hover:bg-white/90 transition-all transform hover:scale-105 flex items-center gap-3 text-xl shadow-xl`}>
                    <span>▶</span> Play
                  </button>
                  <button 
                    className={`${theme.styles.button} text-white px-10 py-4 rounded-lg hover:bg-white/90 transition-all transform hover:scale-105 backdrop-blur-md flex items-center gap-3 text-xl`}
                    onClick={() => {
                      startWatchTogether(selectedMovie);
                      handleCloseModal();
                    }}
                  >
                    <span>👥</span> Watch Together
                  </button>
                </div>
              </div>
            </div>
            <div className="p-12">
              <div className="flex items-center gap-4 text-sm mb-6">
                <span className="text-green-400 font-semibold">98% Match</span>
                <span>2024</span>
                <span className="px-2 py-1 border border-white/40 rounded">HD</span>
                <span>1h 48m</span>
              </div>
              <p className="text-xl text-gray-300 leading-relaxed mb-8">
                Experience the thrill of {selectedMovie.title}. An exciting adventure that will keep you on the edge of your seat. Watch now and join the millions who have already embarked on this incredible journey.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 bg-white/10 rounded-full text-sm">Action</span>
                <span className="px-4 py-2 bg-white/10 rounded-full text-sm">Adventure</span>
                <span className="px-4 py-2 bg-white/10 rounded-full text-sm">Drama</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Watch Together Modal */}
      {watchTogetherMovie && (
        <WatchTogether
          movie={watchTogetherMovie}
          onClose={() => setWatchTogetherMovie(null)}
          theme={theme}
          onAddToCart={(movie) => {
            addToCart(movie);
            setIsCartOpen(true);
          }}
          isInCart={(movieId) => isInCart(movieId)}
          onOpenCart={() => setIsCartOpen(true)}
        />
      )}

      {/* Movie Preview Player */}
      {isWatching && currentlyPlaying && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-6"
          onClick={stopWatching}
        >
          <div 
            className="relative w-full max-w-6xl rounded-lg overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              ref={videoRef}
              className="w-full aspect-video"
              src={currentlyPlaying.videoUrl}
              controls
              autoPlay
            >
              Your browser does not support the video tag.
            </video>
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={stopWatching}
                className="bg-black/60 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-black/80 transition-all transform hover:scale-105 cinematic-blur"
              >
                ✕
              </button>
            </div>
            <div className="bg-black/90 p-6">
              <h2 className="text-2xl font-bold mb-2">{currentlyPlaying.title}</h2>
              <p className="text-gray-400 mb-4">{currentlyPlaying.description}</p>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-400">{currentlyPlaying.duration}</span>
                <span className="text-sm text-gray-400">{currentlyPlaying.rating}</span>
                <span className="text-sm text-gray-400">{currentlyPlaying.releaseYear}</span>
              </div>
              <div className="mt-6 flex gap-4">
                {currentlyPlaying.inStock && !isInCart(currentlyPlaying.id) && (
                  <button
                    onClick={() => addToCart(currentlyPlaying)}
                    className={`${theme.styles.button} text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2`}
                  >
                    🛒 Add to Cart - ${currentlyPlaying.price}
                  </button>
                )}
                {isInCart(currentlyPlaying.id) && (
                  <button
                    onClick={() => setIsCartOpen(true)}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
                  >
                    ✓ In Cart - View Cart
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage; 