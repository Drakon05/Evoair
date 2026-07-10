import React, { useState } from 'react';

const CardSwap = ({ children }) => {
  const [cards, setCards] = useState(React.Children.toArray(children));

  const handleSwap = () => {
    setCards((prev) => {
      const newCards = [...prev];
      const first = newCards.shift();
      newCards.push(first);
      return newCards;
    });
  };

  return (
    <div 
      style={{ 
        position: 'relative', 
        width: '100%', 
        maxWidth: '480px', 
        height: '280px', 
        margin: '60px auto',
        perspective: '1000px',
        cursor: 'pointer'
      }}
      onClick={handleSwap}
    >
      {cards.map((child, index) => {
        const isFront = index === 0;
        const scale = 1 - index * 0.06;
        const translateY = index * 24;
        const opacity = Math.max(1 - index * 0.3, 0);
        const zIndex = cards.length - index;
        
        return (
          <div
            key={child.key || index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              transition: 'all 0.6s cubic-bezier(0.25, 1, 0.5, 1)',
              transform: `translateY(${translateY}px) scale(${scale})`,
              opacity: opacity,
              zIndex: zIndex,
              pointerEvents: isFront ? 'auto' : 'none',
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '32px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            }}
          >
            <div style={{ width: '100%' }}>
              {child}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CardSwap;
