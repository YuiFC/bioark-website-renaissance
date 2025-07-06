
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FeaturedSections = () => {
  const featuredProducts = [
    {
      title: '2 × Fast SYBR Green qPCR Master Mix',
      description: 'High-performance qPCR reagent for rapid and accurate amplification',
      category: 'Reagents',
      image: '/images/1-BSY3323_2__Fast_SYBR_Green_qPCR_Master_Mix-300x300.jpg'
    },
    {
      title: 'BAPoly® DNA Transfection Reagent',
      description: 'Advanced transfection solution for efficient gene delivery',
      category: 'Transfection',
      image: '/images/BAPoly-1-300x300.png'
    },
    {
      title: 'Western Protein Marker I',
      description: 'Reliable protein markers for Western blot analysis',
      category: 'Markers',
      image: '/images/BAPM2086_Western_Protein_Marker_I-1-300x300.jpg'
    }
  ];

  const geneEditingProducts = [
    {
      title: 'Targeted Knock-In',
      description: 'Precise gene insertion at specific genomic locations',
      category: 'Gene Editing',
      image: '/images/Product-1-2-Gene-Knock-In-Tagging-300x227.jpg'
    },
    {
      title: 'Gene Knock-Out',
      description: 'Complete gene disruption for functional studies',
      category: 'Gene Editing',
      image: '/images/Product-1-3-Gene-Knock-out-300x200.jpg'
    },
    {
      title: 'RNA Knock-Down',
      description: 'Targeted reduction of gene expression',
      category: 'Gene Editing',
      image: '/images/Product-1-5-CRISPR-RNA-Knock-Down-300x128.png'
    }
  ];

  const ProductCard = ({ title, description, category, image }: { title: string; description: string; category: string; image: string }) => (
    <Card className="bioark-card group hover:shadow-lg transition-all duration-300">
      <CardHeader>
        {/* Product Image */}
        <div className="w-full h-32 bg-gradient-to-br from-muted to-muted/50 rounded-xl overflow-hidden flex items-center justify-center mb-4">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
        <CardTitle className="text-lg group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <span className="inline-block px-3 py-1 bioark-primary-gradient text-primary-foreground text-sm rounded-full font-medium shadow-sm">
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 bg-muted/30 py-16 rounded-2xl">
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
                  src="/images/Service-4-Experiment-Services-298x300.jpg" 
                  alt="Custom research and collaborative work"
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
