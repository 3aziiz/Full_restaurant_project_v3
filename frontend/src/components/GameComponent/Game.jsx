import React, { useState } from 'react';

const SpinWheelGame = ({ onClose, onWin }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [prize, setPrize] = useState('');

  const prizes = [
    { text: 'FREE BOOKING', color: '#FF6B6B', icon: '📅' },
    { text: 'UNLIMITED PREORDERS', color: '#4ECDC4', icon: '🍽️' },
    { text: 'FREE BOOKING', color: '#45B7D1', icon: '📅' },
    { text: 'UNLIMITED PREORDERS', color: '#96CEB4', icon: '🍽️' },
    { text: 'FREE BOOKING', color: '#FFEAA7', icon: '📅' },
    { text: 'UNLIMITED PREORDERS', color: '#DDA0DD', icon: '🍽️' },
    { text: 'FREE BOOKING', color: '#98D8C8', icon: '📅' },
    { text: 'UNLIMITED PREORDERS', color: '#F7DC6F', icon: '🍽️' }
  ];

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setShowResult(false);
    
    const spins = 5 + Math.random() * 5; // 5-10 full rotations
    const finalAngle = Math.random() * 360;
    const totalRotation = rotation + (spins * 360) + finalAngle;
    
    setRotation(totalRotation);
    
    setTimeout(() => {
      // Calculate which prize was won
      const normalizedAngle = (360 - (totalRotation % 360) + 22.5) % 360;
      const prizeIndex = Math.floor(normalizedAngle / 45);
      const wonPrize = prizes[prizeIndex];
      
      setPrize(wonPrize);
      setShowResult(true);
      setIsSpinning(false);
      
      if (onWin) {
        onWin(wonPrize.text);
      }
    }, 4000);
  };

  const resetGame = () => {
    setShowResult(false);
    setPrize('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="text-3xl mb-2">🎯</div>
          <h2 className="text-2xl font-bold mb-1">SPIN TO WIN!</h2>
          <p className="text-blue-100">Win free bookings & unlimited preorders!</p>
        </div>

        {/* Game Content */}
        <div className="p-8">
          {!showResult ? (
            <>
              {/* Wheel Container */}
              <div className="relative w-80 h-80 mx-auto mb-8">
                {/* Wheel Background Shadow */}
                <div className="absolute inset-0 bg-gray-900 rounded-full transform translate-x-1 translate-y-1 opacity-20"></div>
                
                {/* Main Wheel */}
                <div 
                  className="relative w-full h-full rounded-full border-8 border-gray-800 overflow-hidden shadow-xl transition-transform ease-out"
                  style={{ 
                    transform: `rotate(${rotation}deg)`,
                    transitionDuration: isSpinning ? '4s' : '0.3s'
                  }}
                >
                  {prizes.map((prize, index) => {
                    const angle = index * 45;
                    const nextAngle = (index + 1) * 45;
                    
                    return (
                      <div
                        key={index}
                        className="absolute w-full h-full flex items-center justify-center text-white font-bold text-xs"
                        style={{
                          backgroundColor: prize.color,
                          clipPath: `polygon(50% 50%, 
                            ${50 + 45 * Math.cos((angle - 22.5) * Math.PI / 180)}% ${50 + 45 * Math.sin((angle - 22.5) * Math.PI / 180)}%, 
                            ${50 + 45 * Math.cos((nextAngle - 22.5) * Math.PI / 180)}% ${50 + 45 * Math.sin((nextAngle - 22.5) * Math.PI / 180)}%)`
                        }}
                      >
                        <div 
                          className="text-center px-2"
                          style={{ transform: `rotate(${angle + 22.5}deg)` }}
                        >
                          <div className="text-lg mb-1">{prize.icon}</div>
                          <div className="text-[10px] leading-tight font-extrabold text-shadow">
                            {prize.text}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Center Circle */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gray-800 rounded-full border-4 border-white flex items-center justify-center">
                    <div className="text-white text-xl">🎯</div>
                  </div>
                </div>
                
                {/* Pointer */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
                  <div className="relative">
                    <div className="w-0 h-0 border-l-6 border-r-6 border-b-12 border-l-transparent border-r-transparent border-b-indigo-600 drop-shadow-lg"></div>
                    <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-indigo-600 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Spin Button */}
              <div className="text-center">
                <button
                  onClick={spinWheel}
                  disabled={isSpinning}
                  className={`px-12 py-4 rounded-full text-white font-bold text-xl shadow-lg transform transition-all duration-200 ${
                    isSpinning 
                      ? 'bg-gray-400 cursor-not-allowed scale-95' 
                      : 'bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700 hover:from-blue-600 hover:via-purple-700 hover:to-indigo-800 hover:scale-105 hover:shadow-xl active:scale-95'
                  }`}
                >
                  {isSpinning ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      SPINNING...
                    </div>
                  ) : (
                    '🎲 SPIN NOW!'
                  )}
                </button>
                
                {!isSpinning && (
                  <p className="text-gray-500 text-sm mt-3">
                    Click the button to spin the wheel!
                  </p>
                )}
              </div>
            </>
          ) : (
            /* Result Screen */
            <div className="text-center py-4">
              <div className="text-6xl mb-4 animate-bounce">🎉</div>
              
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl p-6 mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">CONGRATULATIONS!</h3>
                <div className="bg-white rounded-xl p-4 mx-4">
                  <div className="text-4xl mb-2">{prize.icon}</div>
                  <p className="text-2xl font-bold text-gray-800">{prize.text}</p>
                  {prize.text === 'FREE BOOKING' && (
                    <p className="text-sm text-gray-600 mt-2">Book any table without reservation fees!</p>
                  )}
                  {prize.text === 'UNLIMITED PREORDERS' && (
                    <p className="text-sm text-gray-600 mt-2">Place unlimited preorders for this month!</p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3 justify-center">
                <button
                  onClick={resetGame}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105"
                >
                  🔄 Spin Again
                </button>
                <button
                  onClick={onClose}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all transform hover:scale-105"
                >
                  🎁 Claim Prize
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Game Trigger Button Component
const SpinGameButton = ({ onPlay }) => {
  return (
    <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-2xl p-6 mb-8 text-white shadow-xl overflow-hidden relative">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="absolute top-0 right-0 text-8xl opacity-20 transform rotate-12">📅</div>
      
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-2">🎯 WIN AMAZING PERKS!</h2>
          <p className="text-blue-100 mb-4 text-lg">
            Spin our wheel to win free bookings or unlimited preorders!
          </p>
          <button
            onClick={onPlay}
            className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            🎲 SPIN TO WIN
          </button>
        </div>
        <div className="hidden md:block text-6xl ml-6 animate-pulse">
          🍽️
        </div>
      </div>
    </div>
  );
};

// Demo Component
const SpinWheelDemo = () => {
  const [showGame, setShowGame] = useState(false);
  const [wonPrizes, setWonPrizes] = useState([]);

  const handleGameWin = (prize) => {
    setWonPrizes(prev => [...prev, { 
      prize, 
      date: new Date().toLocaleString(),
      id: Date.now()
    }]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          🎯 Restaurant Booking Spin Wheel
        </h1>
        
        {/* Game Trigger */}
        <SpinGameButton onPlay={() => setShowGame(true)} />



        {/* Feature Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">📅</div>
              <h3 className="text-xl font-bold text-gray-800">Free Booking</h3>
            </div>
            <p className="text-gray-600">
              Skip all reservation fees and book any available table instantly without extra charges.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">🍽️</div>
              <h3 className="text-xl font-bold text-gray-800">Unlimited Preorders</h3>
            </div>
            <p className="text-gray-600">
              Place as many preorders as you want for the entire month without any restrictions.
            </p>
          </div>
        </div>

        {/* Spin Wheel Game Modal */}
        {showGame && (
          <SpinWheelGame
            onClose={() => setShowGame(false)}
            onWin={handleGameWin}
          />
        )}
      </div>
    </div>
  );
};

export default SpinWheelDemo;