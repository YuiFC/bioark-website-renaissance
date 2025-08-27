
import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Top links: expanded and left-aligned */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 w-full">
          {/* Explore */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/products" className="hover:text-primary transition-colors">Products</Link></li>
              <li><Link to="/services" className="hover:text-primary transition-colors">Services</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/request-quote" className="hover:text-primary transition-colors">Request Quote</Link></li>
            </ul>
          </div>
          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/why-bioark" className="hover:text-primary transition-colors">Why BioArk</Link></li>
              <li><Link to="/investors" className="hover:text-primary transition-colors">Investors</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          {/* Store */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">Store</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="https://store.bioarktech.com/signup" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Account</a></li>
              <li><a href="https://store.bioarktech.com/cart" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Shopping Cart</a></li>
              <li><a href="https://store.bioarktech.com/design" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Design</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar: expanded */}
        <div className="border-t mt-12 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Left: brand + legal */}
          <div className="flex items-center gap-4">
            <img src="/images/Logo-768x295-removebg-preview.png" alt="BioArk Logo" className="h-12 w-auto" />
            <div className="text-sm">
              <p className="opacity-80">© {new Date().getFullYear()} Bioark Technologies, LLC. All Rights Reserved</p>
              <div className="flex items-center gap-6 mt-2">
                <Link to="/terms" className="opacity-80 hover:text-primary transition-colors">Terms</Link>
                <Link to="/privacy" className="opacity-80 hover:text-primary transition-colors">Privacy</Link>
              </div>
            </div>
          </div>
          {/* Right: socials */}
          <div className="flex items-center gap-5">
            <a href="#" aria-label="Twitter" className="opacity-80 hover:text-primary transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" aria-label="LinkedIn" className="opacity-80 hover:text-primary transition-colors">
              <Linkedin size={20} />
            </a>
            <a href="#" aria-label="YouTube" className="opacity-80 hover:text-primary transition-colors">
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
