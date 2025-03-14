import { useState } from 'react';
import { Navbar, Dropdown, Button, Container } from 'react-bootstrap';
import { Sun, Moon, Globe } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import './h93jdk8si6n.css'; // Import the CSS file

const NavbarComponent = () => {
  // State for dark/light theme
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // i18n translation hook
  const { i18n } = useTranslation();

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
    document.body.classList.toggle('dark-theme', !isDarkTheme);
  };

  // Handle language change
  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language.toLowerCase()); // Change the language using i18n
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'Deutsch' },
  ];

  return (
    <div className="fetch">
      <Navbar bg={isDarkTheme ? 'dark' : 'light'} variant={isDarkTheme ? 'dark' : 'light'} expand="lg" className="py-3">
        <Container fluid>
          {/* Centered Logo */}
          <Navbar.Brand href="/" className="logo-container mx-auto d-block">
          <div className='logo'>
             <h2>FlyNet Downloader</h2>
          </div>
           
          </Navbar.Brand>

          {/* Theme Toggle Button and Language Selector on the right */}
          <div className="ms-auto thoms">
            {/* Theme Toggle Button */}
            <Button
              variant={isDarkTheme ? 'outline-light' : 'outline-dark'}
              onClick={toggleTheme}
              className="mr-2"
              style={{ transition: 'all 0.3s ease' }}
            >
              {isDarkTheme ? <Sun /> : <Moon />}
            </Button>

            {/* Language Selector Dropdown */}
            <Dropdown className="ddB">
              <Dropdown.Toggle
                variant={isDarkTheme ? 'outline-light' : 'outline-dark'}
                id="dropdown-language"
                style={{ transition: 'all 0.3s ease' }}
              >
                <Globe className="mr-2" />
                {languages.find(lang => lang.code === i18n.language)?.name || 'English'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {languages.map(lang => (
                  <Dropdown.Item
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className="ddp"
                    style={{ transition: 'background-color 0.3s ease' }}
                  >
                    {lang.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavbarComponent; // Renamed for clarity and consistency