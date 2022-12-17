import React from 'react';
import './App.css';
import Switcher from './Switcher';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-light-gray dark:bg-dark-gray text-theme-color transition">
      <Switcher />
      <Header />
      <Content />
      <Footer />
    </div>
  );
}

export default App;
