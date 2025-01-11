declare global {
  interface Window {
    dndHooks?: {
      useDragOriginal?: any;
    };
  }
}

export {}; // This ensures the file is treated as a module.
