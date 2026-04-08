import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
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
  inputClassName = 'pl-12 py-5',
  containerClassName = 'auth-field',
  errorClassName = 'text-[10px]',
  iconClassName = 'left-4',
  rightElement,
}: AuthInputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`${containerClassName} space-y-2`}>
      <label className='text-[10px] text-muted-foreground uppercase tracking-widest font-bold'>
        {label}
      </label>
      <div className='relative'>
        <Icon className={`absolute ${iconClassName} top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40`} />
        <Input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={cn(
            'bg-muted/30 hover:bg-muted/50 transition-colors rounded-xl text-foreground placeholder:text-muted-foreground/40 focus-visible:ring-blue-500/20',
            'pl-12',
            error
              ? 'border-destructive/50 focus-visible:border-destructive/50'
              : 'border-border focus-visible:border-blue-500/30',
            inputClassName
          )}
        />
        {isPassword && !rightElement && (
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute ${iconClassName.replace('left', 'right')} top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors`}
          >
            {showPassword ? (
              <EyeOff className='w-4 h-4' />
            ) : (
              <Eye className='w-4 h-4' />
            )}
          </button>
        )}
        {rightElement && (
          <div className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40'>
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className={`${errorClassName} text-destructive font-bold pl-1 mt-1`}>{error}</p>}
    </div>
  );
}
