
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import heroBackground from '../assets/hero-background-new.jpg';

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
          {/* Supporting heading (smaller, gradient) */}
          <div className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Genetic Innovation
            </span>
          </div>

          {/* Main heading (bold, impactful, keep in one line) */}
          <h1 className="mt-2 md:mt-3 text-4xl md:text-6xl lg:text-7xl font-extrabold text-foreground tracking-tight leading-tight whitespace-nowrap">
            Innovative seed on board
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Your trusted CRO partner for advanced gene editing and delivery solutions, accelerating research from discovery to therapy.
          </p>
          
          {/* Modern CTA Button (Request a Quote removed as requested) */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <Button asChild size="lg" className="bioark-btn-primary px-8 font-semibold">
              <Link to="/services">Explore Services</Link>
            </Button>
          </div>

          {/* Divider between text and metrics (clearer brand-tinted color) */}
          <div className="mt-8 pt-6 border-t border-primary/40">
            {/* Reputation metrics: stacked (value above, label below), smaller fonts, no gradient */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 max-w-lg">
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-extrabold text-foreground">4.9/5</span>
                <span className="text-xs md:text-sm text-muted-foreground">Avg. rating</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-extrabold text-foreground">300+</span>
                <span className="text-xs md:text-sm text-muted-foreground">Trusted partners</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl md:text-3xl font-extrabold text-foreground">99%</span>
                <span className="text-xs md:text-sm text-muted-foreground">Success Rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Hero;
