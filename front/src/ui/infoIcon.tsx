'use client';

import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface InfoIconProps {
  message: React.ReactNode;
  popupSize?: 'sm' | 'md' | 'lg';
  className?: string;
  iconClassName?: string;
  popupClassName?: string;
}

const InfoIcon: React.FC<InfoIconProps> = ({
  message,
  popupSize = 'md',
  className = '',
  iconClassName = '',
  popupClassName = '',
}) => {
  const [showInfo, setShowInfo] = useState(false);

  const sizeClasses = {
    sm: 'w-48',
    md: 'w-64',
    lg: 'w-80',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <Info
        className={`h-4 w-4 cursor-pointer ${iconClassName}`}
        onMouseEnter={() => setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
      />
      {showInfo && (
        <div
          className={`absolute z-10 p-2 rounded-md text-sm ${sizeClasses[popupSize]} ${popupClassName}`}
          style={{ bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px' }}
        >
          {message}
          <div 
            className="absolute"
            style={{
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '8px solid currentColor',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default InfoIcon;
