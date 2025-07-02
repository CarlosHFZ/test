import { InputHTMLAttributes, forwardRef } from 'react';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  (props, ref) => (
    <input
      ref={ref}
      {...props}
      style={{
        width: '100%',
        border: '1px solid #c2b280',
        borderRadius: '6px',
        padding: '8px 12px',
        fontSize: '1rem',
        marginBottom: '4px',
        outline: 'none',
        transition: 'border 0.2s',
        boxSizing: 'border-box',
        ...props.style
      }}
    />
  )
);
Input.displayName = 'Input';
