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
        { name: '2 × Fast SYBR Green qPCR Master Mix', image: '/lovable-uploads/fa015458-3001-427a-b816-4db6868b7cf4.png', slug: '2-fast-sybr-green-qpcr-master-mix' },
        { name: '2 × SYBR Green qPCR Master Mix', image: '/lovable-uploads/54707b79-b255-48c7-a5f9-20579adb82c3.png', slug: '2-sybr-green-qpcr-master-mix' },
        { name: 'Western Protein Marker I (Exposure)', image: '/lovable-uploads/219e0265-4771-4a23-8849-a50f86f7aa95.png', slug: 'western-protein-marker-i-exposure' },
        { name: 'Prestained Protein Marker IV (8-200 kDa)', image: '/lovable-uploads/eff136f4-2eeb-4c18-9dc6-7252f46cc30a.png', slug: 'prestained-protein-marker-iv-8-200-kda' },
        { name: 'BAPoly® In Vitro DNA Transfection Reagent', image: '/lovable-uploads/fa6853f1-5309-4c32-945f-ee34e835d8dd.png', slug: 'bapoly-in-vitro-dna-transfection-reagent' },
        { name: 'BAJet® In Vitro DNA Transfection Reagent', image: '/lovable-uploads/6b172cba-00ba-498f-be94-0cb545ffdaaa.png', slug: 'bajet-in-vitro-dna-transfection-reagent' },
        { name: 'BioArkLipo® In Vitro Transfection Kit (Ver. II)', image: '/lovable-uploads/7ad603f4-e3e0-4849-ac5d-d0dffb561610.png', slug: 'bioarklipo-in-vitro-transfection-kit-ver-ii' },
        { name: 'GN15K DNA Marker (500-15000bp)', image: '/lovable-uploads/191bd1c1-51dd-418a-aaad-91f66a68b0b3.png', slug: 'gn15k-dna-marker-500-15000bp' },
        { name: 'GN10K DNA Marker (300-10000bp)', image: '/lovable-uploads/449d0c14-ace9-47c0-a7c7-e7022b9a588d.png', slug: 'gn10k-dna-marker-300-10000bp' },
        { name: 'GN8K DNA Marker (100-8000bp)', image: '/lovable-uploads/191bd1c1-51dd-418a-aaad-91f66a68b0b3.png', slug: 'gn8k-dna-marker-100-8000bp' }
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
      products: [{ name: 'Custom vector clones and plasmid systems coming soon', image: '/lovable-uploads/fd8ed12f-0621-4d21-9df7-68f4e17db710.png', slug: null }],
      gradient: 'from-secondary to-primary',
      comingSoon: true
    },
    {
      title: 'Stable Cell Lines',
      description: 'Engineered cell lines for consistent research applications',
      products: [{ name: 'Stable cell line development services available', image: '/lovable-uploads/82c4717e-8036-4332-a946-833661341b80.png', slug: null }],
      gradient: 'from-primary/80 to-accent/80',
      comingSoon: true
    },
    {
      title: 'Lentivirus',
      description: 'Viral packaging solutions for gene delivery',
      products: [{ name: 'Lentiviral packaging and production services', image: '/lovable-uploads/8b59e1eb-205a-41b1-a763-36963f130eef.png', slug: null }],
      gradient: 'from-accent/80 to-secondary/80',
      comingSoon: true
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 bioark-hero-gradient bio-pattern-cells">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Gene Editing and Delivery Products
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Comprehensive molecular tools and reagents to accelerate your genetic research
              </p>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {productCategories.map((category, index) => (
                <Card key={index} className="bioark-card group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-lg bioark-${['primary', 'secondary', 'accent', 'primary', 'secondary'][index % 5]}-gradient mb-4 flex items-center justify-center shadow-lg`}>
                        <div className="w-6 h-6 bg-white/30 rounded-full animate-pulse-glow" />
                      </div>
                      {category.comingSoon && (
                        <Badge variant="secondary" className="bg-muted text-muted-foreground">
                          Coming Soon
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl text-foreground group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-secondary group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                      {category.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Product Images Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {category.products.slice(0, 4).map((product, productIndex) => (
                        <div key={productIndex} className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-xl overflow-hidden flex items-center justify-center hover:shadow-lg transition-all duration-300">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                    <ul className="space-y-3">
                      {category.products.map((product, productIndex) => (
                        <li key={productIndex} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-2 flex-shrink-0 animate-pulse-glow" />
                          {product.slug ? (
                            <Link 
                              to={`/products/${product.slug}`}
                              className={`text-sm text-foreground hover:text-primary hover:underline transition-colors cursor-pointer font-medium`}
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
        <section className="py-16 bioark-hero-gradient bio-pattern-dna">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              <span className="bg-gradient-to-r from-secondary via-primary to-accent bg-clip-text text-transparent">
                Need Custom Solutions?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our team can develop custom molecular tools and reagents tailored to your specific research needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/request-quote"
                className="bioark-btn-primary inline-flex items-center justify-center transform hover:scale-105 transition-all duration-300"
              >
                Request Custom Quote
              </a>
              <a
                href="/contact"
                className="bioark-btn-secondary inline-flex items-center justify-center transform hover:scale-105 transition-all duration-300"
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
