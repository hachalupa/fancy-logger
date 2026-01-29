export function Section({ 
  children, 
  className = '',
  id = null,
  centered = false 
}) {
  const classes = [
    'section',
    'container',
    centered && 'text-center',
    className
  ].filter(Boolean).join(' ');

  return (
    <section className={classes} id={id}>
      {children}
    </section>
  );
}
