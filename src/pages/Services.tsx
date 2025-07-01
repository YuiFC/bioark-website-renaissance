
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Services = () => {
  const services = [
    {
      title: 'Cloning Services',
      description: 'Expert molecular cloning for custom plasmid construction and vector development',
      features: ['Custom plasmid design', 'Gene synthesis', 'Vector optimization', 'Quality verification'],
      gradient: 'from-primary to-accent'
    },
    {
      title: 'Lentivirus Packaging',
      description: 'Professional viral packaging services for gene delivery applications',
      features: ['High-titer production', 'Custom vector packaging', 'Quality control testing', 'Rapid turnaround'],
      gradient: 'from-accent to-secondary'
    },
    {
      title: 'Stable Cell Line',
      description: 'Development of stable cell lines for consistent research applications',
      features: ['Cell line engineering', 'Clone selection', 'Characterization', 'Banking services'],
      gradient: 'from-secondary to-primary'
    },
    {
      title: 'Experiment Services',
      description: 'Comprehensive experimental support for your research projects',
      features: ['Custom assay development', 'Data analysis', 'Protocol optimization', 'Technical consultation'],
      gradient: 'from-primary/80 to-accent/80'
    },
    {
      title: 'Lab Supplies',
      description: 'Essential laboratory reagents and consumables for molecular biology',
      features: ['Quality reagents', 'Competitive pricing', 'Reliable supply chain', 'Technical support'],
      gradient: 'from-accent/80 to-secondary/80'
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
                Professional molecular services to accelerate your research and development
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 h-full">
                  <CardHeader>
                    {/* Service Image Placeholder */}
                    <div className="w-full h-32 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center text-muted-foreground/70">
                        <div className="w-12 h-12 mx-auto mb-2 rounded border-2 border-dashed border-current flex items-center justify-center">
                          <span className="text-xs">LAB</span>
                        </div>
                        <p className="text-xs">Service Image</p>
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${service.gradient} mb-4 flex items-center justify-center`}>
                      <div className="w-6 h-6 bg-white/30 rounded-full" />
                    </div>
                    <CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Our Service Process</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                From consultation to delivery, we ensure quality and efficiency at every step
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: '01', title: 'Consultation', description: 'Discuss your project requirements and objectives' },
                { step: '02', title: 'Planning', description: 'Develop a customized experimental approach' },
                { step: '03', title: 'Execution', description: 'Perform services with rigorous quality control' },
                { step: '04', title: 'Delivery', description: 'Provide results with comprehensive documentation' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bioark-gradient rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">{item.step}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Contact our team to discuss your specific needs and receive a customized service proposal.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/request-quote"
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
              >
                Get Service Quote
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-primary text-base font-medium rounded-md text-primary bg-transparent hover:bg-primary hover:text-white transition-colors"
              >
                Schedule Consultation
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Services;
