import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = '', ...props }, ref) => (
    <button
      ref={ref}
      {...props}
      className={className}
      style={{
        width: '100%',
        padding: '10px 0',
        borderRadius: '8px',
        background: '#a97c50',
        color: '#fff',
        border: 'none',
        fontWeight: 600,
        fontSize: '1rem',
        transition: 'background 0.2s',
        opacity: props.disabled ? 0.5 : 1,
        ...props.style
      }}
    >
      {children}
    </button>
  )
);

Button.displayName = 'Button';
