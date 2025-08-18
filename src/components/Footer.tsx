
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-card border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/lovable-uploads/9b80f083-86c0-4e24-a873-9afa9b5be0e1.png" 
                alt="BioArk Technologies Logo" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-foreground">BioArk Technologies</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Biotechnology and biopharmaceutical CRO specializing in gene editing and delivery solutions. 
              Engineering DNA and RNA to accelerate discoveries in genetic medicine.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-muted-foreground hover:text-primary transition-colors">Products</Link></li>
              <li><Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">Services</Link></li>
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/investors" className="text-muted-foreground hover:text-primary transition-colors">Investors</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-foreground font-semibold mb-4">Contact</h3>
            <div className="space-y-2">
              <p className="text-muted-foreground">
                <span className="font-medium">Phone:</span><br />
                1-734-604-2386
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Email:</span><br />
                support@bioarktech.com
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium">Address:</span><br />
                13 Taft, Suite 213<br />
                Rockville, MD, 20850
              </p>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 Bioark Technologies, LLC. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
