import React from 'react';
import './ShinyText.css';

interface ShinyTextProps {
  children: React.ReactNode;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({ 
  children, 
  disabled = false, 
  speed = 5,
  className = '' 
}) => {
  return (
    <div 
      className={`shiny-text ${disabled ? 'disabled' : ''} ${className}`}
      style={{ '--animation-speed': `${speed}s` } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

export default ShinyText;