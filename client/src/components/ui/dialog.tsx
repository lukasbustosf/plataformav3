import React, { useState } from 'react';

interface DialogProps {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

interface DialogTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface DialogTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const Dialog: React.FC<DialogProps> = ({ children, open, onOpenChange }) => {
  const [isOpen, setIsOpen] = useState(open || false);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { ...child.props, isOpen, onOpenChange: handleOpenChange });
        }
        return child;
      })}
    </div>
  );
};

export const DialogTrigger: React.FC<DialogTriggerProps & { isOpen?: boolean; onOpenChange?: (open: boolean) => void }> = ({ 
  children, 
  isOpen, 
  onOpenChange 
}) => {
  const handleClick = () => {
    if (onOpenChange) {
      onOpenChange(true);
    }
  };

  return (
    <div onClick={handleClick}>
      {children}
    </div>
  );
};

export const DialogContent: React.FC<DialogContentProps & { isOpen?: boolean; onOpenChange?: (open: boolean) => void }> = ({ 
  children, 
  className = '',
  isOpen,
  onOpenChange
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onOpenChange) {
      onOpenChange(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackdropClick}
    >
      <div className={`bg-white rounded-lg p-6 max-w-md w-full mx-4 ${className}`}>
        {children}
      </div>
    </div>
  );
};

export const DialogHeader: React.FC<DialogHeaderProps> = ({ children, className = '' }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
};

export const DialogTitle: React.FC<DialogTitleProps> = ({ children, className = '' }) => {
  return (
    <h2 className={`text-xl font-semibold text-gray-900 ${className}`}>
      {children}
    </h2>
  );
}; 