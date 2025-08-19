import React from 'react';
import Layout from '/src/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '/src/components/ui/card';

const investors = [
  {
    name: 'BioArk Technologies',
    logo: '/images/BioArk-Logo-Circle-1-300x300.png',
    description: 'As a foundational investor and the core of our ecosystem, BioArk Technologies drives our mission forward with its pioneering research and development in gene editing and delivery.'
  },
  {
    name: 'Catalyst Ventures',
    logo: null,
    description: 'A leading venture capital firm specializing in early-stage biotech startups. Their investment has been crucial for scaling our platform technologies.'
  },
  {
    name: 'Genome Future Fund',
    logo: null,
    description: 'A global fund dedicated to advancing genomic medicine. Their support enables our long-term research into novel therapeutic areas.'
  },
  {
    name: 'Innovate Health Partners',
    logo: null,
    description: 'A strategic partner focused on bridging the gap between laboratory research and clinical applications. They provide invaluable expertise in navigating the regulatory landscape.'
  }
];

const Investors = () => {
  return (
    <Layout>
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Our Investors
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We are proud to be backed by visionary partners who share our commitment to advancing genetic medicine.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {investors.map(investor => (
            <Card key={investor.name}>
              <CardHeader>
                <div className="flex items-center gap-4">
                  {investor.logo && (
                    <img src={investor.logo} alt={`${investor.name} Logo`} className="h-14 w-14" />
                  )}
                  <CardTitle className="text-2xl">{investor.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{investor.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Investors;