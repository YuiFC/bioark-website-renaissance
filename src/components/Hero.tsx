
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '/src/components/ui/button';
import heroBackground from '/src/assets/hero-background-new.jpg';

const Hero = () => {
  return (
    <section className="relative h-[85vh] min-h-[600px] lg:h-[768px] flex items-center justify-start overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{backgroundImage: `url(${heroBackground})`}}
      ></div>
      {/* Gradient Overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent"></div>
      {/* Subtle DNA Pattern Overlay */}
      <div className="absolute inset-0 bio-pattern-dna opacity-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl text-left animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="block text-foreground">Pioneering</span>
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Genetic Innovation
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Your trusted CRO partner for advanced gene editing and delivery solutions, accelerating research from discovery to therapy.
          </p>
          
          {/* Modern CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Button asChild size="lg" className="bioark-btn-primary px-8 font-semibold">
              <Link to="/services">Explore Services</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-2 border-foreground/50 text-foreground hover:bg-foreground hover:text-background px-8">
              <Link to="/request-quote">Request a Quote</Link>
            </Button>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
