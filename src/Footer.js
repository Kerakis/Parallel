import React from 'react';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="flex-shrink-0 box-border pt-8 text-sm text-white text-center md:fixed md:m-1 md:bottom-0 md:right-1">
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
