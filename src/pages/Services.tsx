
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { customerSolutions } from '@/data/showcase';
import { ArrowRight } from 'lucide-react';

const Services = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-background">
  {/* Hero Section */
  }
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
    Services
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Partner with our expert team for tailored services that meet your unique project requirements, from discovery to delivery.
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {customerSolutions.map((service) => {
                const Icon = service.icon;
                return (
                  <Card key={service.id} className="group flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                    <CardHeader>
                      {Icon && (
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 self-start">
                          <Icon className="w-8 h-8 text-primary" />
                        </div>
                      )}
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {service.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col">
                      <p className="text-muted-foreground flex-grow">{service.description}</p>
                      <Link to={service.link} className="inline-flex items-center text-primary font-semibold mt-6 self-start">
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Ready to Accelerate Your Research?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Our team is ready to discuss your project. Let's collaborate to achieve your scientific goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bioark-btn-primary px-8 font-semibold">
                <Link to="/request-quote">Request a Quote</Link>
              </Button>
              {/* Contact removed as requested */}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Services;
