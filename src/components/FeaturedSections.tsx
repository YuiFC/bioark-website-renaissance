
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FeaturedSections = () => {
  const featuredProducts = [
    {
      title: '2 × Fast SYBR Green qPCR Master Mix',
      description: 'High-performance qPCR reagent for rapid and accurate amplification',
      category: 'Reagents',
      image: '/lovable-uploads/fa015458-3001-427a-b816-4db6868b7cf4.png'
    },
    {
      title: 'BAPoly® DNA Transfection Reagent',
      description: 'Advanced transfection solution for efficient gene delivery',
      category: 'Transfection',
      image: '/lovable-uploads/fa6853f1-5309-4c32-945f-ee34e835d8dd.png'
    },
    {
      title: 'Western Protein Marker I',
      description: 'Reliable protein markers for Western blot analysis',
      category: 'Markers',
      image: '/lovable-uploads/219e0265-4771-4a23-8849-a50f86f7aa95.png'
    }
  ];

  const geneEditingProducts = [
    {
      title: 'Targeted Knock-In',
      description: 'Precise gene insertion at specific genomic locations',
      category: 'Gene Editing',
      image: '/lovable-uploads/e9da7cfe-7c51-47c2-b80c-b2809f5b8989.png'
    },
    {
      title: 'Gene Knock-Out',
      description: 'Complete gene disruption for functional studies',
      category: 'Gene Editing',
      image: '/lovable-uploads/ec21403a-7f7d-49e1-8ef6-3ac75a214aed.png'
    },
    {
      title: 'RNA Knock-Down',
      description: 'Targeted reduction of gene expression',
      category: 'Gene Editing',
      image: '/lovable-uploads/91502ed7-38c8-4936-8909-b6ad3f7e88ea.png'
    }
  ];

  const ProductCard = ({ title, description, category, image }: { title: string; description: string; category: string; image: string }) => (
    <Card className="group relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 transform hover:-translate-y-2">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <CardHeader className="relative z-10">
        {/* Product Image */}
        <div className="w-full h-40 bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl overflow-hidden flex items-center justify-center mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <CardTitle className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">{title}</CardTitle>
        <CardDescription className="text-muted-foreground leading-relaxed">{description}</CardDescription>
      </CardHeader>
      <CardContent className="relative z-10">
        <span className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary/20 to-accent/20 text-primary text-sm rounded-full font-semibold border border-primary/20 group-hover:border-primary/40 transition-all duration-300">
          {category}
        </span>
      </CardContent>
    </Card>
  );

  return (
    <div className="py-16 bg-background">
      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Featured Products</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            High-quality molecular reagents and tools for advanced genetic research
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
      </section>

      {/* Gene Editing Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="bg-gradient-to-br from-muted/40 to-muted/20 backdrop-blur-sm py-16 rounded-3xl border border-border/30">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Gene Editing Products</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Comprehensive genome editing solutions for precise genetic modifications
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {geneEditingProducts.map((product, index) => (
            <ProductCard key={index} {...product} />
          ))}
        </div>
        </div>
      </section>

      {/* Custom Solutions Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-2xl p-8 lg:p-12 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">Custom Solutions</h2>
              <p className="text-muted-foreground mb-6">
                BioArk Technologies is a biotechnology and biopharmaceutical CRO specializing in gene editing and delivery. 
                Using proprietary platforms, our team engineers DNA and RNA to support research across therapeutic areas 
                such as immunology, oncology, and neuroscience. We offer comprehensive molecular services, viral packaging, 
                and stable cell line development to help accelerate discoveries and advance genetic medicine.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/services"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                >
                  View Services
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center justify-center px-6 py-3 border border-primary text-base font-medium rounded-md text-primary bg-transparent hover:bg-primary hover:text-white transition-colors"
                >
                  Contact Us
                </a>
              </div>
            </div>
            <div>
              {/* Custom Solutions Image */}
              <div className="w-full h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg overflow-hidden flex items-center justify-center">
                <img 
                  src="/lovable-uploads/f4af09c0-35c8-4f40-8614-bbc990fb94e0.png" 
                  alt="Advanced laboratory equipment and research facility"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturedSections;
