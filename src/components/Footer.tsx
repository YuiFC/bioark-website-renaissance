
import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top: Keep four columns: Explore, Company, Contact, Store */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
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
              <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/investors" className="hover:text-primary transition-colors">Investors</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/contact" className="hover:text-primary transition-colors">Get in touch</Link></li>
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

        {/* Bottom area: Left (Logo, Copyright, Terms/Privacy) | Right (Contact info above social icons) */}
        <div className="border-t mt-10 pt-8">
          <div className="flex flex-col sm:flex-row justify-between gap-8">
            {/* Left column: 3 lines */}
            <div className="flex-1">
              <img src="/images/Logo-768x295-removebg-preview.png" alt="BioArk Logo" className="h-12 w-auto mb-3" />
              <p className="opacity-80 text-sm mb-2">
                © {new Date().getFullYear()} Bioark Technologies, LLC. All Rights Reserved
              </p>
              <div className="flex gap-6 text-sm">
                <Link to="/terms" className="opacity-80 hover:text-primary transition-colors">Terms</Link>
                <Link to="/privacy" className="opacity-80 hover:text-primary transition-colors">Privacy</Link>
              </div>
            </div>

            {/* Right column: Contact info over socials */}
            <div className="flex-1 flex flex-col items-start sm:items-end">
              <div className="text-sm text-muted-foreground space-y-1 mb-3 text-left sm:text-right">
                <div><span className="text-foreground font-medium">Phone:</span> 1-734-604-2386</div>
                <div><span className="text-foreground font-medium">Email:</span> support@bioarktech.com</div>
                <div>
                  <span className="text-foreground font-medium">Address:</span> 13 Taft, Suite 213<br className="hidden sm:inline" />
                  Rockville, MD, 20850
                </div>
              </div>
              <div className="flex items-center gap-4">
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
        </div>
      </div>
    </footer>
  );
};

export default Footer;
