import React from 'react';

type ButtonProps<T extends React.ElementType> = {
  as?: T;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  Icon?: React.ElementType;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<T>;

const Button = <T extends React.ElementType = 'button'>({
  as,
  variant = 'primary',
  Icon,
  children,
  className = '',
  disabled = false,
  ...props
}: ButtonProps<T>) => {
  const Component = as || 'button';

  let baseStyles = 'font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out focus:outline-none focus:shadow-outline';
  let variantStyles = '';

  switch (variant) {
    case 'primary':
      variantStyles = 'bg-tajheez-orange hover:bg-tajheez-orange-darker text-white';
      break;
    case 'secondary':
      variantStyles = 'bg-gray-300 hover:bg-gray-400 text-gray-800';
      break;
    case 'danger':
      variantStyles = 'bg-tajheez-red hover:bg-red-600 text-white';
      break;
    case 'outline':
      variantStyles = 'bg-transparent border border-tajheez-orange text-tajheez-orange hover:bg-tajheez-orange hover:text-white';
      break;
    default:
      variantStyles = 'bg-tajheez-orange hover:bg-tajheez-orange-darker text-white';
  }

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <Component
      className={`${baseStyles} ${variantStyles} ${disabledStyles} ${Icon ? 'flex items-center justify-center space-x-2' : ''} ${className}`}
      disabled={Component === 'button' ? disabled : undefined}
      {...props}
    >
      {Icon && <Icon className="h-5 w-5" />}
      <span>{children}</span>
    </Component>
  );
};

export default Button;
