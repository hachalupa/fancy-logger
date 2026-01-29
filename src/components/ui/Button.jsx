export function Button({ 
  children, 
  variant = 'primary',  // primary | secondary | ghost
  size = 'base',        // base | lg | sm
  ...props 
}) {
  const variantClass = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'btn-ghost'
  }[variant];

  const sizeClass = {
    base: '',
    lg: 'btn-lg',
    sm: 'btn-sm'
  }[size];

  return (
    <button 
      className={`btn ${variantClass} ${sizeClass}`}
      {...props}
    >
      {children}
    </button>
  );
}
