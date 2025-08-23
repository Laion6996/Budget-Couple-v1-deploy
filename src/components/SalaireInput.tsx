import { useState, useEffect } from 'react';
import { z } from 'zod';

const salaireSchema = z.object({
  montant: z.number().min(0, 'Le salaire doit être positif')
});

interface SalaireInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export const SalaireInput = ({ label, value, onChange }: SalaireInputProps) => {
  const [localValue, setLocalValue] = useState(value.toString());
  const [localError, setLocalError] = useState<string>('');

  useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    setLocalError('');

    const numValue = parseFloat(newValue);
    if (!isNaN(numValue) && numValue >= 0) {
      onChange(numValue);
    }
  };

  const handleBlur = () => {
    const result = salaireSchema.safeParse({ montant: parseFloat(localValue) });
    
    if (!result.success) {
      setLocalError(result.error.issues[0]?.message || 'Valeur invalide');
    } else {
      setLocalError('');
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      
      <div className="relative">
        <input
          type="number"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          min="0"
          step="0.01"
          className={`w-full px-3 py-2 bg-gray-700 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            localError ? 'border-red-500' : 'border-gray-600'
          }`}
          placeholder="0.00"
        />
        
        <div className="absolute right-3 top-2.5 text-gray-400">
          €
        </div>
        
      </div>
      
      {localError && (
        <p className="text-sm text-red-400">
          {localError}
        </p>
      )}
    </div>
  );
}; 