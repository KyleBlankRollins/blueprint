/// <reference types="vite/client" />

/**
 * Type declarations for Vite special imports
 */

// Raw text imports (e.g., .svg?raw)
declare module '*?raw' {
  const content: string;
  export default content;
}

// SVG imports as components (if needed in the future)
declare module '*.svg' {
  const content: string;
  export default content;
}
