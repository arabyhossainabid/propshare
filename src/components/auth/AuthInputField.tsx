import { Input } from '@/components/ui/input';
import { Eye, EyeOff, LucideIcon } from 'lucide-react';
import React, { useState } from 'react';

interface AuthInputFieldProps {
  label: string;
  icon: LucideIcon;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  inputClassName?: string;
  containerClassName?: string;
  errorClassName?: string;
  iconClassName?: string;
  rightElement?: React.ReactNode;
}

export function AuthInputField({
  label,
  icon: Icon,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  inputClassName = 'pl-10 py-5',
  containerClassName = 'auth-field',
  errorClassName = 'text-[10px]',
  iconClassName = 'left-3',
  rightElement,
}: AuthInputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`${containerClassName} space-y-2`}>
      <label className='text-xs text-white/40 uppercase tracking-wider font-medium'>
        {label}
      </label>
      <div className='relative'>
        <Icon className={`absolute ${iconClassName} top-1/2 -translate-y-1/2 w-4 h-4 text-white/20`} />
        <Input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`bg-white/5 rounded-xl ${inputClassName} text-white placeholder:text-white/20 focus-visible:ring-blue-500/30 ${
            error
              ? 'border-red-500/50 focus-visible:border-red-500/50'
              : 'border-white/10 focus-visible:border-blue-500/30'
          }`}
        />
        {isPassword && !rightElement && (
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute ${iconClassName.replace('left', 'right')} top-1/2 -translate-y-1/2 text-white/20 hover:text-white/40 transition-colors`}
          >
            {showPassword ? (
              <EyeOff className='w-4 h-4' />
            ) : (
              <Eye className='w-4 h-4' />
            )}
          </button>
        )}
        {rightElement && (
          <div className='absolute right-3 top-1/2 -translate-y-1/2 text-white/20'>
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className={`${errorClassName} text-red-400 pl-1`}>{error}</p>}
    </div>
  );
}
