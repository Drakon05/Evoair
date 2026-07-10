import React from 'react';

const Masonry = ({ children, columns = 3, gap = 24 }) => {
  // Distribute children into columns
  const cols = Array.from({ length: columns }, () => []);
  
  React.Children.forEach(children, (child, index) => {
    cols[index % columns].push(child);
  });

  return (
    <div style={{ display: 'flex', gap: `${gap}px`, width: '100%', maxWidth: '1000px', margin: '40px auto' }}>
      {cols.map((col, colIndex) => (
        <div key={colIndex} style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px`, flex: 1 }}>
          {col.map((child, i) => {
            // Add staggered extra padding to create an asymmetrical Masonry effect
            const extraPadding = (i + colIndex) % 2 === 0 ? '60px' : '0px';
            
            return (
              <div 
                key={i} 
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '24px',
                  paddingTop: `calc(40px + ${extraPadding})`,
                  paddingBottom: `calc(40px + ${extraPadding})`,
                  paddingLeft: '32px',
                  paddingRight: '32px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transition: 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1), background 0.4s ease',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px) scale(1)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                <div style={{ width: '100%' }}>
                  {child}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Masonry;
