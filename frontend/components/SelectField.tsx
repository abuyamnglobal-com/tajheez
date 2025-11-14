import React from 'react';

interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  error?: string;
  Icon?: React.ElementType;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  id,
  value,
  onChange,
  options,
  error,
  Icon,
  className = '',
  ...props
}) => {
  const selectId = id || name;
  const hasIcon = !!Icon;

  return (
    <div>
      <label htmlFor={selectId} className="block text-gray-700 text-sm font-bold mb-2">
        {label}
      </label>
      <div className="relative">
        {hasIcon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
        )}
        <select
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          className={`shadow appearance-none border rounded w-full py-2 ${hasIcon ? 'pl-10 pr-3' : 'px-3'} text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${error ? 'border-tajheez-red' : ''} ${className}`}
          {...props}
        >
          <option value="">{`Select ${label}`}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-tajheez-red text-xs italic mt-1">{error}</p>}
    </div>
  );
};

export default SelectField;
