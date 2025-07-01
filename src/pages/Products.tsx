import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const Products = () => {
  const productCategories = [
    {
      title: 'Reagents and Markers',
      description: 'High-quality molecular reagents and markers for research applications',
      products: [
        { name: '2 × Fast SYBR Green qPCR Master Mix', image: '/images/1-BSY3323_2__Fast_SYBR_Green_qPCR_Master_Mix-300x300.jpg', slug: '2-fast-sybr-green-qpcr-master-mix' },
        { name: '2 × SYBR Green qPCR Master Mix', image: '/images/1-BSY3320_2__SYBR_Green_qPCR_Master_Mix-300x300.jpg', slug: '2-sybr-green-qpcr-master-mix' },
        { name: 'Western Protein Marker I (Exposure)', image: '/images/BAPM2086_Western_Protein_Marker_I-1-300x300.jpg', slug: 'western-protein-marker-i-exposure' },
        { name: 'Prestained Protein Marker IV (8-200 kDa)', image: '/images/BioArk-Logo-Circle-1-300x300.png', slug: 'prestained-protein-marker-iv-8-200-kda' },
        { name: 'BAPoly® In Vitro DNA Transfection Reagent', image: '/images/BAPoly-1-300x300.png', slug: 'bapoly-in-vitro-dna-transfection-reagent' },
        { name: 'BAJet® In Vitro DNA Transfection Reagent', image: '/images/BAjet-1-300x300.png', slug: 'bajet-in-vitro-dna-transfection-reagent' },
        { name: 'BioArkLipo® In Vitro Transfection Kit (Ver. II)', image: '/images/BioArkLipo-1-300x300.png', slug: 'bioarklipo-in-vitro-transfection-kit-ver-ii' },
        { name: 'GN15K DNA Marker (500-15000bp)', image: '/images/BADM3364_GN15K_DNA_Marker-1-300x300.jpg', slug: 'gn15k-dna-marker-500-15000bp' },
        { name: 'GN10K DNA Marker (300-10000bp)', image: '/images/BADM3363_GN10K_DNA_Marker-1-300x300.jpg', slug: 'gn10k-dna-marker-300-10000bp' },
        { name: 'GN8K DNA Marker (100-8000bp)', image: '/images/BADM3362_GN8K_DNA_Marker-1-300x300.jpg', slug: 'gn8k-dna-marker-100-8000bp' }
      ],
      gradient: 'from-primary to-accent'
    },
    {
      title: 'Genome Editing',
      description: 'Advanced tools for precise genome modifications',
      products: [
        { name: 'Targeted Knock-In', image: '/images/Product-1-2-Gene-Knock-In-Tagging-300x227.jpg', slug: 'targeted-knock-in' },
        { name: 'Knock-In Tagging', image: '/images/Product-1-2-Gene-Knock-In-Tagging-300x227.jpg', slug: 'knock-in-tagging' },
        { name: 'Gene Knock-Out', image: '/images/Product-1-3-Gene-Knock-out-300x200.jpg', slug: 'gene-knock-out' },
        { name: 'Gene Deletion', image: '/images/Product-1-4-Gene-Deletion-300x180.jpeg', slug: 'gene-deletion' },
        { name: 'RNA Knock-Down', image: '/images/Product-1-5-CRISPR-RNA-Knock-Down-300x128.png', slug: 'rna-knock-down' }
      ],
      gradient: 'from-accent to-secondary'
    },
    {
      title: 'Vector Clones',
      description: 'Custom vector systems for gene expression and delivery',
      products: [{ name: 'Custom vector clones and plasmid systems coming soon', image: '/images/BioArk-Logo-Circle-1-300x300.png', slug: null }],
      gradient: 'from-secondary to-primary',
      comingSoon: true
    },
    {
      title: 'Stable Cell Lines',
      description: 'Engineered cell lines for consistent research applications',
      products: [{ name: 'Stable cell line development services available', image: '/images/Service-3-Stable-Cell-Line-Services-300x119.jpeg', slug: null }],
      gradient: 'from-primary/80 to-accent/80',
      comingSoon: true
    },
    {
      title: 'Lentivirus',
      description: 'Viral packaging solutions for gene delivery',
      products: [{ name: 'Lentiviral packaging and production services', image: '/images/BioArk-Logo-Circle-1-300x300.png', slug: null }],
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
                    {/* Product Images Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {category.products.slice(0, 4).map((product, productIndex) => (
                        <div key={productIndex} className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-lg overflow-hidden flex items-center justify-center">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <ul className="space-y-3">
                      {category.products.map((product, productIndex) => (
                        <li key={productIndex} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-2 flex-shrink-0" />
                          {product.slug ? (
                            <Link 
                              to={`/products/${product.slug}`}
                              className={`text-sm text-foreground hover:text-primary hover:underline transition-colors cursor-pointer`}
                            >
                              {product.name}
                            </Link>
                          ) : (
                            <span className={`text-sm ${category.comingSoon ? 'text-muted-foreground italic' : 'text-foreground'}`}>
                              {product.name}
                            </span>
                          )}
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
