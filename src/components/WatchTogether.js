import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WatchTogether = ({ movie, onClose, theme, onAddToCart, isInCart, onOpenCart }) => {
  const [roomId, setRoomId] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [participants, setParticipants] = useState(1);
  const [status, setStatus] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [username, setUsername] = useState('');
  const [showJoinForm, setShowJoinForm] = useState(true);
  const [joinRoomId, setJoinRoomId] = useState('');
  const wsRef = useRef(null);
  const videoRef = useRef(null);
  const chatRef = useRef(null);
  const [showUI, setShowUI] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [reactions, setReactions] = useState([]);
  const [viewMode, setViewMode] = useState('default'); // 'default', 'minimal', 'theater'

  const emojis = ['👍', '❤️', '😂', '😮', '😢', '😡'];

  useEffect(() => {
    // Connect to WebSocket server
    wsRef.current = new WebSocket('ws://localhost:3001');

    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'ROOM_CREATED':
          setRoomId(data.roomId);
          setIsHost(true);
          setShowJoinForm(false);
          setStatus('Room created! Share the code with friends.');
          addMessage('System', 'Room created successfully! Share the room code with friends to watch together.');
          break;

        case 'JOINED_ROOM':
          setRoomId(data.roomId);
          setShowJoinForm(false);
          setStatus('Joined room successfully!');
          if (videoRef.current) {
            videoRef.current.currentTime = data.currentTime;
            if (data.isPlaying) {
              videoRef.current.play();
              setIsPlaying(true);
            } else {
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }
          addMessage('System', 'Successfully joined the room!');
          break;

        case 'PARTICIPANT_JOINED':
          setParticipants(data.participantCount);
          addMessage('System', `${data.username} joined the room`);
          break;

        case 'PARTICIPANT_LEFT':
          setParticipants(data.participantCount);
          addMessage('System', `${data.username} left the room`);
          break;

        case 'CHAT_MESSAGE':
          addMessage(data.username, data.message);
          break;

        case 'VIDEO_STATE_CHANGE':
          if (!isHost && videoRef.current) {
            if (data.isPlaying) {
              videoRef.current.play();
              setIsPlaying(true);
            } else {
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }
          break;

        case 'VIDEO_SEEK':
          if (!isHost && videoRef.current) {
            videoRef.current.currentTime = data.currentTime;
          }
          break;

        case 'ERROR':
          setStatus(data.message);
          addMessage('System', `Error: ${data.message}`);
          break;
      }
    };

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [isHost]);

  useEffect(() => {
    let timeout;
    const handleMouseMove = () => {
      setShowUI(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowUI(false), 3000);
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  const createRoom = () => {
    if (!username.trim()) {
      setStatus('Please enter a username');
      return;
    }

    wsRef.current.send(JSON.stringify({
      type: 'CREATE_ROOM',
      movieId: movie.id,
      username: username
    }));
  };

  const joinRoom = () => {
    if (!username.trim()) {
      setStatus('Please enter a username');
      return;
    }
    if (!joinRoomId.trim()) {
      setStatus('Please enter a room code');
      return;
    }

    wsRef.current.send(JSON.stringify({
      type: 'JOIN_ROOM',
      roomId: joinRoomId,
      username: username
    }));
  };

  const addMessage = (username, text) => {
    setMessages(prev => [...prev, { username, text, time: new Date().toLocaleTimeString() }]);
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    wsRef.current.send(JSON.stringify({
      type: 'CHAT_MESSAGE',
      roomId,
      username,
      message: newMessage
    }));

    setNewMessage('');
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
    if (isHost) {
      wsRef.current.send(JSON.stringify({
        type: 'VIDEO_STATE_CHANGE',
        roomId,
        isPlaying: true
      }));
    }
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
    if (isHost) {
      wsRef.current.send(JSON.stringify({
        type: 'VIDEO_STATE_CHANGE',
        roomId,
        isPlaying: false
      }));
    }
  };

  const handleVideoSeek = () => {
    if (isHost && videoRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'VIDEO_SEEK',
        roomId,
        currentTime: videoRef.current.currentTime
      }));
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const sendReaction = (emoji) => {
    const newReaction = {
      emoji,
      id: Date.now(),
      position: { x: mousePosition.x, y: mousePosition.y }
    };
    setReactions(prev => [...prev, newReaction]);
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 2000);

    wsRef.current.send(JSON.stringify({
      type: 'REACTION',
      roomId,
      username,
      emoji
    }));
  };

  if (showJoinForm) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
      >
        <div className="w-full max-w-md bg-gradient-to-br from-black/90 to-gray-900/90 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl border border-white/10">
          <motion.div 
            className="p-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Watch Together: {movie.title}
            </h2>
            <div className="space-y-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <label className="block text-sm font-medium mb-2 text-white/80">Your Name</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-white/5 rounded-lg px-4 py-3 text-white border border-white/10 
                           focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent
                           transition-all duration-300 group-hover:bg-white/10"
                />
              </motion.div>
              
              <div className="flex gap-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={createRoom}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-6 
                           rounded-lg font-medium shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40
                           transition-all duration-300"
                >
                  Create Room
                </motion.button>
                <div className="flex items-center text-white/40">or</div>
                <motion.div 
                  className="flex-1 flex gap-2"
                  whileHover={{ scale: 1.02 }}
                >
                  <input
                    type="text"
                    value={joinRoomId}
                    onChange={(e) => setJoinRoomId(e.target.value)}
                    placeholder="Room Code"
                    className="flex-1 bg-white/5 rounded-lg px-4 py-3 text-white border border-white/10 
                             focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent
                             transition-all duration-300"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={joinRoom}
                    className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-6 rounded-lg 
                             font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40
                             transition-all duration-300"
                  >
                    Join
                  </motion.button>
                </motion.div>
              </div>

              {status && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm"
                >
                  {status}
                </motion.p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full bg-white/5 hover:bg-white/10 text-white/80 py-3 rounded-lg 
                         font-medium transition-all duration-300 border border-white/10"
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <div 
      className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
      onMouseMove={handleMouseMove}
    >
      <AnimatePresence>
        {reactions.map(reaction => (
          <motion.div
            key={reaction.id}
            initial={{ scale: 0, y: 0 }}
            animate={{ scale: 1, y: -50 }}
            exit={{ scale: 0, y: -100 }}
            className="absolute text-2xl pointer-events-none"
            style={{ left: reaction.position.x, top: reaction.position.y }}
          >
            {reaction.emoji}
          </motion.div>
        ))}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`w-full max-w-7xl bg-gradient-to-br from-black/90 to-gray-900/90 rounded-2xl 
                   overflow-hidden shadow-2xl backdrop-blur-xl border border-white/10 
                   flex ${viewMode === 'theater' ? 'flex-col' : 'flex-col md:flex-row'} gap-4`}
      >
        {/* Video Section */}
        <div className="flex-1 relative group">
          <video
            ref={videoRef}
            className="w-full aspect-video rounded-lg"
            src={movie.videoUrl || movie.thumbnailVideo}
            onPlay={handleVideoPlay}
            onPause={handleVideoPause}
            onSeeked={handleVideoSeek}
            controls
          />
          
          <AnimatePresence>
            {showUI && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute bottom-4 left-4 right-4 flex items-center justify-between 
                         bg-gradient-to-t from-black/80 to-transparent p-4 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowEmoji(!showEmoji)}
                    className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-all"
                  >
                    😊
                  </motion.button>

                  {showEmoji && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute bottom-16 left-4 bg-white/10 backdrop-blur-xl 
                               rounded-xl p-2 flex gap-2"
                    >
                      {emojis.map(emoji => (
                        <motion.button
                          key={emoji}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.8 }}
                          onClick={() => sendReaction(emoji)}
                          className="text-2xl cursor-pointer"
                        >
                          {emoji}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}

                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"/>
                      <span className="text-sm">{participants} watching</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {roomId && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={copyRoomId}
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 rounded-lg 
                               px-4 py-2 text-sm transition-all backdrop-blur-sm"
                    >
                      <span>Room: {roomId}</span>
                      <span className="text-xs">{copied ? '✓' : '📋'}</span>
                    </motion.button>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode(viewMode === 'default' ? 'theater' : 'default')}
                    className="bg-white/10 hover:bg-white/20 rounded-lg p-2 transition-all"
                  >
                    {viewMode === 'default' ? '🎭' : '📺'}
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {isHost && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute top-4 right-16 bg-gradient-to-r from-red-500 to-pink-500 
                       rounded-lg px-4 py-2 text-sm font-medium shadow-lg shadow-red-500/20"
            >
              Host
            </motion.div>
          )}

          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/10 text-white w-10 h-10 rounded-full 
                     flex items-center justify-center backdrop-blur-sm hover:bg-white/20 
                     transition-all transform"
          >
            ✕
          </motion.button>
        </div>

        {/* Chat and Info Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`${viewMode === 'theater' ? 'w-full h-80' : 'w-full md:w-96'} 
                     bg-white/5 backdrop-blur-xl p-6 rounded-lg flex flex-col gap-4`}
        >
          <div className="space-y-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 
                         bg-clip-text text-transparent">{movie.title}</h2>
            <p className="text-sm text-gray-400">{movie.description}</p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{movie.duration}</span>
              <span>•</span>
              <span>{movie.rating}</span>
              <span>•</span>
              <span>{movie.releaseYear}</span>
            </div>
          </div>

          {movie.price && (
            <motion.div 
              className="space-y-3 border-t border-white/10 pt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Price:</span>
                <span className="font-bold text-white">${movie.price}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Format:</span>
                <span className="text-white">{movie.format}</span>
              </div>
              {movie.inStock ? (
                isInCart ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onOpenCart}
                    className="w-full bg-green-600/80 hover:bg-green-600 text-white py-2 
                             rounded-lg font-medium flex items-center justify-center gap-2 
                             transition-all backdrop-blur-sm"
                  >
                    ✓ In Cart - View Cart
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onAddToCart(movie)}
                    className={`w-full ${theme.styles.button} text-white py-2 rounded-lg 
                              font-medium flex items-center justify-center gap-2 transition-all`}
                  >
                    🛒 Add to Cart - ${movie.price}
                  </motion.button>
                )
              ) : (
                <button
                  className="w-full bg-gray-600/50 text-white/70 py-2 rounded-lg 
                           font-medium cursor-not-allowed backdrop-blur-sm"
                  disabled
                >
                  Out of Stock
                </button>
              )}
            </motion.div>
          )}

          {/* Chat Section */}
          <div className="flex-1 flex flex-col min-h-0">
            <div 
              ref={chatRef}
              className="flex-1 space-y-2 overflow-y-auto mb-4 scrollbar-thin 
                       scrollbar-thumb-white/20 scrollbar-track-transparent"
            >
              <AnimatePresence>
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-white/5 backdrop-blur-sm rounded-lg p-3 group 
                             hover:bg-white/10 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium bg-gradient-to-r from-white to-gray-400 
                                   bg-clip-text text-transparent">{msg.username}</span>
                      <span className="text-gray-400 text-xs group-hover:text-white 
                                   transition-colors">{msg.time}</span>
                    </div>
                    <p className="text-sm text-gray-200 mt-1">{msg.text}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-white/5 backdrop-blur-sm rounded-lg px-4 py-2 text-sm 
                         border border-white/10 focus:outline-none focus:ring-2 
                         focus:ring-white/20 focus:border-transparent transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className={`${theme.styles.button} px-6 py-2 rounded-lg text-white font-medium 
                         shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 
                         transition-all`}
              >
                Send
              </motion.button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WatchTogether; 