
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Services = () => {
  const services = [
    {
      title: 'Cloning Services',
      description: 'Custom DNA cloning and vector construction services for research applications',
      image: '/lovable-uploads/0c6f0d24-0fd4-41c4-a39d-ddfafa8b10a7.png',
      features: [
        'Plasmid construction and optimization',
        'Gene synthesis and assembly',
        'Vector modification and customization',
        'Quality control and verification'
      ]
    },
    {
      title: 'Lentivirus Packaging',
      description: 'Professional lentiviral packaging services for gene delivery applications',
      image: '/lovable-uploads/a6ea2f2a-ba27-4516-bbea-37efa3c7cff8.png',
      features: [
        'High-titer virus production',
        'Custom packaging protocols',
        'Quality testing and validation',
        'Scalable production options'
      ]
    },
    {
      title: 'Stable Cell Line',
      description: 'Development of stable cell lines for consistent research applications',
      image: '/lovable-uploads/13dbfda7-f44d-45a0-bb45-e5bda75ebcc5.png',
      features: [
        'Cell line engineering and selection',
        'Transfection and integration',
        'Clonal isolation and characterization',
        'Long-term stability testing'
      ]
    },
    {
      title: 'Experiment Services',
      description: 'Comprehensive experimental services to support your research goals',
      image: '/lovable-uploads/a7a33956-b5c5-4245-b5e0-de7c42689a4a.png',
      features: [
        'Custom experimental design',
        'Data analysis and interpretation',
        'Protocol development',
        'Research consultation'
      ]
    },
    {
      title: 'Lab Supplies',
      description: 'High-quality laboratory supplies and consumables for molecular research',
      image: '/lovable-uploads/a7a33956-b5c5-4245-b5e0-de7c42689a4a.png',
      features: [
        'Research-grade reagents',
        'Laboratory consumables',
        'Specialized equipment',
        'Custom supply packages'
      ]
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
                Gene Editing and Delivery Services
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Professional services to accelerate your genetic research and development
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    {/* Service Image */}
                    <div className="w-full h-48 bg-gradient-to-br from-muted to-muted/50 rounded-lg overflow-hidden flex items-center justify-center mb-4">
                      <img 
                        src={service.image} 
                        alt={service.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {service.title}
                    </CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-2 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
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
              Ready to Get Started?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Contact us to discuss your project requirements and learn how our services can support your research.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/request-quote"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              >
                Request Service Quote
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

export default Services;
