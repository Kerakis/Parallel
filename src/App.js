import React from 'react';
import './App.css';
import Header from './Header';
import Content from './Content';
import Footer from './Footer';

function App() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-2rem)] text-theme-color m-4">
      <Header />
      <Content />
      <Footer />
    </div>
  );
}

export default App;
