import React from 'react';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'danger' | 'info';
  Icon?: React.ElementType;
  children: React.ReactNode;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  variant = 'info',
  Icon,
  children,
  className = '',
}) => {
  const baseStyles = 'px-3 py-1 rounded-full text-xs font-semibold';
  let variantStyles = '';

  switch (variant) {
    case 'success':
      variantStyles = 'bg-tajheez-green-light text-tajheez-green';
      break;
    case 'warning':
      variantStyles = 'bg-tajheez-orange-light text-tajheez-orange';
      break;
    case 'danger':
      variantStyles = 'bg-tajheez-red-light text-tajheez-red';
      break;
    case 'info':
      variantStyles = 'bg-blue-100 text-blue-800'; // Using a default blue for info
      break;
    default:
      variantStyles = 'bg-blue-100 text-blue-800';
  }

  return (
    <span className={`${baseStyles} ${variantStyles} ${Icon ? 'flex items-center space-x-1' : ''} ${className}`}>
      {Icon && <Icon className="h-4 w-4" />}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
