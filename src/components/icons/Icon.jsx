/**
 * Компонент Icon — для отображения SVG иконок
 * Использует CSS переменные для цвета
 */
export function Icon({ 
  svg,                    // SVG строка из icons.js
  size = '24px',         // размер по умолчанию
  color = 'currentColor', // наследует цвет от родителя
  className = '',        // доп. CSS классы
  ariaLabel = '',        // доступность
  ariaHidden = false     // скрыть от screen readers если true
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={`icon ${className}`}
      style={{ 
        color,
        display: 'inline-block',
        verticalAlign: 'middle'
      }}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      role={ariaHidden ? undefined : 'img'}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
