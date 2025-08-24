import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  type: 'text' | 'number' | 'email' | 'password';
  value: string | number;
  onChange: (value: string | number) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
}

/**
 * Composant de champ de formulaire avec validation et messages d'erreur
 * Supporte la validation en temps réel et l'affichage des erreurs
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type,
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  required = false,
  min,
  max,
  step,
  disabled = false,
  className = '',
  ariaLabel
}) => {
  const hasError = !!error;
  
  const getInputStyles = () => {
    const baseStyles = "w-full px-3 py-2 bg-gray-600 border rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200";
    
    if (hasError) {
      return `${baseStyles} border-red-500 ring-red-500 focus:border-red-500`;
    }
    
    return `${baseStyles} border-gray-500 focus:border-blue-500 focus:ring-blue-500`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = type === 'number' ? Number(e.target.value) : e.target.value;
    onChange(newValue);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      <label 
        htmlFor={name}
        className={`block text-sm font-medium ${
          hasError ? 'text-red-400' : 'text-gray-300'
        }`}
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      {/* Champ de saisie */}
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={getInputStyles()}
          aria-label={ariaLabel || label}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${name}-error` : undefined}
          required={required}
        />
        
        {/* Icône d'erreur */}
        {hasError && (
          <div className="absolute right-3 top-2.5 text-red-400">
            ⚠️
          </div>
        )}
      </div>

      {/* Message d'erreur */}
      {hasError && (
        <div 
          id={`${name}-error`}
          className="flex items-center space-x-2 text-red-400 text-xs"
          role="alert"
          aria-live="polite"
        >
          <span className="text-red-400">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Indicateur de validation */}
      {!hasError && value && (
        <div className="flex items-center space-x-2 text-green-400 text-xs">
          <span>✅</span>
          <span>Champ valide</span>
        </div>
      )}
    </div>
  );
};
