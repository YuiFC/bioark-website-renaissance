
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Products = () => {
  const productCategories = [
    {
      title: 'Reagents and Markers',
      description: 'High-quality molecular reagents and markers for research applications',
      products: [
        '2 × Fast SYBR Green qPCR Master Mix',
        '2 × SYBR Green qPCR Master Mix',
        'Western Protein Marker I (Exposure)',
        'Prestained Protein Marker IV (8-200 kDa)',
        'BAPoly® In Vitro DNA Transfection Reagent',
        'BAJet® In Vitro DNA Transfection Reagent',
        'BioArkLipo® In Vitro Transfection Kit (Ver. II)',
        'GN15K DNA Marker (500-15000bp)',
        'GN10K DNA Marker (300-10000bp)',
        'GN8K DNA Marker (100-8000bp)'
      ],
      gradient: 'from-primary to-accent'
    },
    {
      title: 'Genome Editing',
      description: 'Advanced tools for precise genome modifications',
      products: [
        'Targeted Knock-In',
        'Knock-In Tagging',
        'Gene Knock-Out',
        'Gene Deletion',
        'RNA Knock-Down'
      ],
      gradient: 'from-accent to-secondary'
    },
    {
      title: 'Vector Clones',
      description: 'Custom vector systems for gene expression and delivery',
      products: ['Custom vector clones and plasmid systems coming soon'],
      gradient: 'from-secondary to-primary',
      comingSoon: true
    },
    {
      title: 'Stable Cell Lines',
      description: 'Engineered cell lines for consistent research applications',
      products: ['Stable cell line development services available'],
      gradient: 'from-primary/80 to-accent/80',
      comingSoon: true
    },
    {
      title: 'Lentivirus',
      description: 'Viral packaging solutions for gene delivery',
      products: ['Lentiviral packaging and production services'],
      gradient: 'from-accent/80 to-secondary/80',
      comingSoon: true
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 bioark-hero-gradient">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Gene Editing and Delivery Products
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive molecular tools and reagents to accelerate your genetic research
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {productCategories.map((category, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${category.gradient} mb-4 flex items-center justify-center`}>
                        <div className="w-6 h-6 bg-white/30 rounded-full" />
                      </div>
                      {category.comingSoon && (
                        <Badge variant="secondary" className="bg-muted text-muted-foreground">
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl text-foreground">{category.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.products.map((product, productIndex) => (
                        <li key={productIndex} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-2 flex-shrink-0" />
                          <span className={`text-sm ${category.comingSoon ? 'text-muted-foreground italic' : 'text-foreground'}`}>
                            {product}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Need Custom Solutions?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our team can develop custom molecular tools and reagents tailored to your specific research needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/request-quote"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              >
                Request Custom Quote
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-primary text-base font-medium rounded-md text-primary bg-transparent hover:bg-primary hover:text-white transition-colors"
              >
                Contact Our Team
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Products;
