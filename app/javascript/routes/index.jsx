import React, { useState } from "react";
import Home from "../components/Home";
import About from "../components/About";
import ContactForm from "../components/ContactForm";
import Services from "../components/Services";

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
      case 'services':
        return <Services />;
      default:
        return <Home />;
    }
  };

  return renderPage();
};

export default <Router />;