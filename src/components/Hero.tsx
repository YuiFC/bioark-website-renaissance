
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
          <Card className="max-w-4xl mx-auto bg-background/95 backdrop-blur-md border-border/50 shadow-xl p-6 md:p-10">
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
                <span className="block text-primary">BioArk Technologies</span>
              </h1>
              <p className="text-2xl md:text-3xl font-semibold mb-6 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                Gene Editing and Gene Delivery Solutions
              </p>
              <p className="text-lg text-muted-foreground mb-6 font-medium opacity-75">
                Research and Development
              </p>
            </div>
            
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed text-center">
              A biotechnology and biopharmaceutical CRO specializing in gene editing and delivery. 
              Using proprietary platforms, our team engineers DNA and RNA to support research across therapeutic areas 
              such as immunology, oncology, and neuroscience.
            </p>
            
            {/* Modern CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <a href="/products">Explore Our Products</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white px-8 py-3 rounded-full transition-all duration-300">
                <a href="/request-quote">Request Quote</a>
              </Button>
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <a href="/services">Learn More</a>
              </Button>
            </div>
          </Card>
        </div>
      </div>

    </section>
  );
};

export default Hero;
