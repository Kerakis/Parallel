import React, { useState } from 'react';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import useDarkMode from './useDarkMode';

export default function Switcher() {
  const [colorTheme, setTheme] = useDarkMode();
  const [darkMode, setDarkMode] = useState(
    colorTheme === 'light' ? true : false
  );

  const toggleDarkMode = (checked) => {
    setTheme(colorTheme);
    setDarkMode(checked);
  };

  return (
    <>
      <div className="flex place-self-end m-2">
        <DarkModeSwitch
          checked={darkMode}
          onChange={toggleDarkMode}
          moonColor={'#00a2e8'}
          sunColor={'#00a2e8'}
          size={20}
        />
      </div>
    </>
  );
}
