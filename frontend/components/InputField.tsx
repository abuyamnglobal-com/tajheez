import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  Icon?: React.ElementType;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  Icon,
  className = '',
  ...props
}) => {
  const inputId = id || name;
  const hasIcon = !!Icon;

  return (
    <div>
      <label htmlFor={inputId} className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <div className="relative">
        {hasIcon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        )}
        <input
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`shadow appearance-none border rounded w-full py-2 ${hasIcon ? 'pl-10 pr-3' : 'px-3'} text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${error ? 'border-tajheez-red' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-tajheez-red text-xs italic mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
