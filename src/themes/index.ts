// Theme exports
export const lightTheme = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = new URL('./light.css', import.meta.url).href;
  document.head.appendChild(link);
};
