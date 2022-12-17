import React, { useEffect, useState } from 'react';
import { DarkModeSwitch } from 'react-toggle-dark-mode';

const isDark = () =>
  (localStorage && localStorage.theme === 'dark') || //Condition 1 - has local storage and theme = dark in local storage is found
  (!('theme' in localStorage) &&
    window.matchMedia('(prefers-color-scheme: dark)').matches); //Condition 2 - No theme key in local storage but media color scheme is dark

const getTheme = (isDark) => (isDark ? 'dark' : 'light'); //Function to return 'dark' or 'light' string

const ThemeSwitch = () => {
  const [darkMode, setDarkMode] = useState(false); //State for holding theme status

  const toggleMode = () => {
    //onClick handler for changing theme on button press
    localStorage.theme = getTheme(!darkMode); //setting up local storage theme value
    if (localStorage.theme === 'dark') {
      // If theme is 'dark'
      document.documentElement.classList.remove('light'); // remove 'light' from html class
      document.documentElement.classList.add('dark'); // add 'dark' to html class
    } else {
      // if not 'dark'
      document.documentElement.classList.remove('dark'); // remove 'dark' from html class
      document.documentElement.classList.add('light'); //add 'light' to html class
    }
    setDarkMode(!darkMode); //set dark mode state to opposite of initial value
  };

  useEffect(() => {
    setDarkMode(isDark()); //before page mount set the value of dark mode by observing theme in local storage
  }, []);

  return (
    <>
      <div className="flex place-self-end m-2">
        <DarkModeSwitch
          checked={darkMode}
          onChange={toggleMode}
          moonColor={'#00a2e8'}
          sunColor={'#00a2e8'}
          size={20}
        />
      </div>
    </>
  );
};
export default ThemeSwitch;
