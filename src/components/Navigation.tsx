
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Menu, X, ShoppingCart, User, Palette, Sun, Moon } from 'lucide-react';
import { useTheme } from '/src/components/ThemeProvider';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const navItems = [
    { name: 'Products', path: '/products' },
    { name: 'Services', path: '/services' },
    { name: 'Blog', path: '/blog' },
    { name: 'Investors', path: '/investors' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const externalLinks = [
    { name: 'My Account', url: 'https://store.bioarktech.com/signup', icon: User },
    { name: 'Shopping Cart', url: 'https://store.bioarktech.com/cart', icon: ShoppingCart },
    { name: 'Design', url: 'https://store.bioarktech.com/design', icon: Palette },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  // The navigation bar text should be light to be visible on the dark hero image.
  // The background appears on scroll, fixing the abrupt transition.
  const navBackgroundClass = isScrolled 
    ? 'bg-[hsl(var(--header-footer-background))]/90 backdrop-blur-lg border-b border-border/20 shadow-sm' 
    : 'bg-transparent';

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 text-[hsl(var(--header-footer-foreground))] ${navBackgroundClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/images/BioArk-Logo-Circle-1-300x300.png"
              alt="BioArk Technologies Logo" 
              className="h-10 w-10"
            />
            <span className="text-xl font-bold hidden sm:inline text-inherit">
              BioArk Technologies
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                  isActivePath(item.path)
                    ? 'text-primary font-semibold' // Active link color should stand out
                    : 'text-inherit opacity-80 hover:text-primary hover:opacity-100'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-border">
              <Button asChild size="sm">
                <Link to="/request-quote">Request Quote</Link>
              </Button>
              {externalLinks.map((link) => {
                const IconComponent = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-md text-inherit opacity-80 hover:text-primary hover:opacity-100 transition-colors duration-200"
                    title={link.name}
                  >
                    <IconComponent size={16} />
                  </a>
                );
              })}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="text-inherit opacity-80 hover:text-primary hover:opacity-100"
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-[hsl(var(--header-footer-background))] border-t shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActivePath('/') ? 'text-primary bg-white/10' : 'text-inherit opacity-80 hover:text-primary hover:bg-white/5'}`}
              >
                Home
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActivePath(item.path)
                      ? 'text-primary bg-white/10'
                      : 'text-inherit opacity-80 hover:text-primary hover:bg-white/5'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="px-3 pt-4">
                <Button asChild className="w-full">
                  <Link to="/request-quote" onClick={() => setIsMenuOpen(false)}>
                    Request Quote
                  </Link>
                </Button>
              </div>
              {/* Mobile External Store Links */}
              <div className="border-t border-border mt-2 pt-2">
                <p className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Store
                </p>
                {externalLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-inherit opacity-80 hover:text-primary hover:bg-white/5 transition-colors duration-200"
                    >
                      <IconComponent size={16} />
                      <span>{link.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
