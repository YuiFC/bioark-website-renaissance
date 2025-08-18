
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import heroBackground from '@/assets/hero-background-new.jpg';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{backgroundImage: `url(${heroBackground})`}}
      ></div>
      <div className="absolute inset-0 bioark-hero-gradient opacity-60"></div>
      {/* Background DNA Pattern */}
      <div className="absolute inset-0 bio-pattern-dna opacity-20"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-12 h-12 rounded-full bg-primary/20 animate-float"></div>
      <div className="absolute top-40 right-20 w-8 h-8 rounded-full bg-secondary/20 animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-40 left-20 w-16 h-16 rounded-full bg-accent/20 animate-float" style={{animationDelay: '4s'}}></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="animate-fade-in-up">
          <Card className="max-w-5xl mx-auto bg-background/95 backdrop-blur-md border-border/50 shadow-2xl p-8 md:p-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-pulse-glow">
                Research and Development
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-card-foreground mb-6 font-medium">
              Gene Editing and Gene Delivery Solutions
            </p>
            <p className="text-base md:text-lg text-muted-foreground max-w-4xl mx-auto mb-10 leading-relaxed">
              BioArk Technologies is a biotechnology and biopharmaceutical CRO specializing in gene editing and delivery. 
              Using proprietary platforms, our team engineers DNA and RNA to support research across therapeutic areas 
              such as immunology, oncology, and neuroscience.
            </p>
            
            {/* Modern CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button asChild className="bioark-btn-primary transform hover:scale-105 transition-all duration-300">
                <a href="/products">Explore Our Products</a>
              </Button>
              <Button asChild className="bioark-btn-secondary transform hover:scale-105 transition-all duration-300">
                <a href="/request-quote">Request Quote</a>
              </Button>
              <Button asChild className="bioark-btn-accent transform hover:scale-105 transition-all duration-300">
                <a href="/services">Learn More</a>
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Hero Image with Modern Styling */}
      <div className="absolute right-10 top-1/2 transform -translate-y-1/2 hidden lg:block">
        <div className="w-96 h-96 relative">
          <div className="absolute inset-0 bioark-primary-gradient rounded-full opacity-20 animate-pulse-glow"></div>
          <img 
            src="/images/Screenshot-2025-04-21-183458-1536x552.png" 
            alt="Genetic Research Visualization"
            className="w-full h-full object-cover rounded-2xl shadow-2xl animate-float"
            style={{filter: 'drop-shadow(0 25px 25px hsl(var(--primary) / 0.3))'}}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent rounded-2xl"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
