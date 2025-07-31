import React from 'react';
import { LOGO_CONFIG, type LogoVariant, type LogoSize } from '@/config/logo';

interface LogoProps {
  variant?: LogoVariant;
  className?: string;
  size?: LogoSize;
  onClick?: () => void;
}

const Logo: React.FC<LogoProps> = ({ 
  variant = 'horizontal', 
  className = '', 
  size = 'md',
  onClick
}) => {
  const getLogoSrc = () => {
    return LOGO_CONFIG.paths[variant];
  };

  const getAltText = () => {
    switch (variant) {
      case 'iconOnly':
      case 'minimal':
        return LOGO_CONFIG.name;
      default:
        return LOGO_CONFIG.fullName;
    }
  };

  return (
    <div 
      className={`flex items-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <img 
        src={getLogoSrc()} 
        alt={getAltText()} 
        className={`${LOGO_CONFIG.sizes[size]} ${LOGO_CONFIG.animations.transition} ${LOGO_CONFIG.animations.hover}`}
      />
    </div>
  );
};

export default Logo; 