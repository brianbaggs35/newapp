import React, { useState } from "react";
import Home from "../components/Home";
import About from "../components/About";
import ContactForm from "../components/ContactForm";

const Router = () => {
  const [currentPage, setCurrentPage] = useState(() => {
    // Get initial page from URL hash or default to home
    const hash = window.location.hash.slice(1);
    return hash || 'home';
  });

  // Handle hash changes
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      setCurrentPage(hash || 'home');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <About />;
      case 'contact':
        return <ContactForm />;
      default:
        return <Home />;
    }
  };

  return renderPage();
};

export default <Router />;