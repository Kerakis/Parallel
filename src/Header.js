import React from 'react';

function Header(format) {
  return (
    <header>
      <h1 className="md:text-5xl text-3xl text-center font-extrabold md:mt-8">
        Parallels
      </h1>
      <h2 className="md:text-2xl text-xl text-dark-gray dark:text-white text-center md:mt-3 mt-2 mb-4">
        The Magic: The Gathering Art Matching Game
      </h2>
      {format !== null && (
        <h3 className="md:text-xl text-l text-dark-gray dark:text-white text-center md:mt-3 mt-2 mb-4">
          Guess the card based on the art!
        </h3>
      )}
      <div></div>
    </header>
  );
}

export default Header;
