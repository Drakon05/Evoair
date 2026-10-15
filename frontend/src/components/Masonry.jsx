import React from 'react';

const Masonry = ({ children, columns = 3, gap = 24 }) => {
  const [currentCols, setCurrentCols] = React.useState(columns);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 968) {
        setCurrentCols(2);
      } else {
        setCurrentCols(columns);
      }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [columns]);

  // Distribute children into columns
  const cols = Array.from({ length: currentCols }, () => []);
  
  React.Children.forEach(children, (child, index) => {
    cols[index % currentCols].push(child);
  });

  return (
    <div style={{ display: 'flex', gap: `${gap}px`, width: '100%', maxWidth: '1000px', margin: '40px auto', flexDirection: currentCols === 1 ? 'column' : 'row' }}>
      {cols.map((col, colIndex) => (
        <div key={colIndex} style={{ display: 'flex', flexDirection: 'column', gap: `${gap}px`, flex: 1 }}>
          {col.map((child, i) => {
            // Add staggered extra padding to create an asymmetrical Masonry effect, but only on desktop
            const extraPadding = currentCols > 1 && (i + colIndex) % 2 === 0 ? '60px' : '0px';
            
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
                  if (currentCols > 1) {
                    e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentCols > 1) {
                    e.currentTarget.style.transform = 'translateY(0px) scale(1)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  }
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
