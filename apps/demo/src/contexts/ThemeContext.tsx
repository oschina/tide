import React, { createContext, useContext, useEffect, useState } from 'react';

export enum Theme {
  Blue = 'blue',
  Purple = 'purple',
  Green = 'green',
  Pink = 'pink',
  Dark = 'dark',
}

export type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  theme: Theme.Blue,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setTheme: () => {},
});

export const useTheme = () => {
  const { theme, setTheme } = useContext(ThemeContext);
  return { theme, setTheme };
};

export const ThemeContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(Theme.Blue);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () =>
      setTheme(mediaQuery.matches ? Theme.Dark : Theme.Blue);
    handler();
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const classList = document.body.classList;
    // remove theme-*
    for (let i = 0; i < classList.length; i++) {
      const name = classList[i];
      if (name.startsWith('theme-')) {
        classList.remove(name);
      }
    }
    // add theme
    if (theme) {
      classList.add(`theme-${theme}`);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
