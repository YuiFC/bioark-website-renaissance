
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { Button } from './ui/button';
import { Menu, X, ShoppingCart, User, Palette } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { featuredProducts, geneEditingProducts, customerSolutions } from '../data/showcase';

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={props.href || '#'}
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-muted focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none text-foreground">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  // Dark mode removed; theme toggle no longer used

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
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src={`${import.meta.env.BASE_URL}images/Logo Transparent.png`}
              alt="BioArk Technologies Logo" 
              className="h-10 w-auto md:h-11"
            />
            <span className="hidden sm:inline text-[17px] md:text-lg font-semibold tracking-tight leading-none text-inherit">
              BioArk Technologies
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            <NavigationMenu>
              <NavigationMenuList>
                {/* Products Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid grid-cols-2 gap-4 p-4 w-[600px] lg:w-[700px]">
                      <div className="flex flex-col space-y-2">
                        <h3 className="font-semibold text-foreground px-3">Featured Product (Reagent)</h3>
                        <ul className="space-y-1">
                          {featuredProducts.map((product) => (
                            <ListItem key={product.id} title={product.name} href={product.link}>
                              {product.description}
                            </ListItem>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <h3 className="font-semibold text-foreground px-3">Gene Editing Product</h3>
                        <ul className="space-y-1">
                          {geneEditingProducts.map((product) => (
                            <ListItem key={product.id} title={product.name} href={product.link}>
                              {product.description}
                            </ListItem>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Customer Solutions Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Customer Solutions</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      {customerSolutions.map((solution) => (
                        <ListItem key={solution.id} title={solution.name} href={solution.link}>
                          {solution.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Other Links */}
            {['Blog', 'Investors', 'About', 'Contact'].map(name => (
              <Link key={name} to={`/${name.toLowerCase()}`} className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap ${isActivePath(`/${name.toLowerCase()}`) ? 'text-primary font-semibold' : 'text-inherit opacity-80 hover:text-primary hover:opacity-100'}`}>
                {name}
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
          <IconComponent size={20} />
                  </a>
                );
              })}
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
              {/* Simplified Mobile Links */}
              {[
                { name: 'Products', path: '/products' },
                { name: 'Customer Solutions', path: '/services' },
                { name: 'Blog', path: '/blog' },
                { name: 'Investors', path: '/investors' },
                { name: 'About', path: '/about' },
                { name: 'Contact', path: '/contact' },
              ].map((item) => (
                <Link key={item.name} to={item.path} onClick={() => setIsMenuOpen(false)} className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${isActivePath(item.path) ? 'text-primary bg-white/10' : 'text-inherit opacity-80 hover:text-primary hover:bg-white/5'}`}>
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
