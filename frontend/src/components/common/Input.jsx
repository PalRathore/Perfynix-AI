import { forwardRef, useId, useState } from 'react';
import { cn } from '../../utils/cn';

const Input = forwardRef(function Input(
  {
    label,
    type = 'text',
    value,
    onChange,
    onBlur,
    onFocus,
    icon: Icon,
    rightElement,
    error,
    autoComplete,
    placeholder,
    name,
    id,
    required = false,
    className = '',
    'aria-describedby': describedBy,
    ...props
  },
  ref
) {
  const reactId = useId();
  const inputId = id || reactId;
  const [focused, setFocused] = useState(false);

  return (
    <div className="w-full text-left">
      {/* Clear Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1.5 block text-xs sm:text-sm font-semibold tracking-[0.02em] text-slate-700 dark:text-slate-200"
        >
          {label}
          {required && <span className="ml-1 text-rose-500">*</span>}
        </label>
      )}

      {/* Input Box Outer Wrapper */}
      <div className="relative flex items-center w-full">
        {/* Left Leading Icon */}
        {Icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center text-slate-400 dark:text-slate-400 transition-colors z-10">
            <Icon size={18} />
          </span>
        )}

        {/* Text Input Element */}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={onChange}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          className={cn(
            'h-12 w-full rounded-2xl border text-sm sm:text-base font-medium transition-all duration-200 outline-none',
            'bg-white/70 text-slate-900 placeholder:text-slate-400 border-slate-200/80 hover:border-slate-300',
            'dark:bg-slate-900/60 dark:text-white dark:placeholder:text-slate-500 dark:border-slate-700/80 dark:hover:border-slate-600',
            focused
              ? 'border-cyan-500 ring-2 ring-cyan-500/25 dark:border-cyan-400 dark:ring-cyan-400/25'
              : '',
            error
              ? 'border-rose-500 ring-2 ring-rose-500/25 dark:border-rose-500 dark:ring-rose-500/25'
              : '',
            Icon ? 'pl-11' : 'pl-4',
            rightElement ? 'pr-11' : 'pr-4',
            className
          )}
          {...props}
        />

        {/* Right Element Slot */}
        {rightElement && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center z-10">
            {rightElement}
          </div>
        )}
      </div>

      {/* Error Message */}
      {typeof error === 'string' && error && (
        <p className="mt-1.5 text-xs font-semibold text-rose-500 dark:text-rose-400">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
