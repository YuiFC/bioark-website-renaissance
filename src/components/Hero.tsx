
import React from 'react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative py-20 bioark-hero-gradient overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-10">
        <img 
          src="/images/Screenshot-2025-04-21-183458-1536x552.png" 
          alt="Genetic research and biotechnology background"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Research and Development
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Gene Editing and Gene Delivery Solutions
          </p>
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <Button 
              asChild
              className="bioark-gradient text-white hover:opacity-90 transition-opacity"
            >
              <a href="/request-quote">Request Quote</a>
            </Button>
            <Button 
              variant="outline" 
              asChild
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              <a href="/products">View Products</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
