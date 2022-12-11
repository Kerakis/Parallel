import React from 'react';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex-shrink-0 mt-8 text-sm text-dark-gray dark:text-light-gray text-center lg:fixed lg:m-1 lg:bottom-0 lg:right-1">
      <p>
        Made with <span className="font-sans">&#9749;</span> by
        <a
          href="https://github.com/Kerakis"
          target="_blank"
          rel="noopener noreferrer"
        >
          &nbsp;Kerakis&nbsp;© {year}
        </a>
      </p>
    </footer>
  );
}

export default Footer;
