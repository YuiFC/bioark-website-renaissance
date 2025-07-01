
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Investors = () => {
  const investmentHighlights = [
    {
      title: 'Growing Demand',
      description: 'Increasing global need for genetic therapies, cell and gene therapy platforms, and molecular research tools.',
      icon: '📈'
    },
    {
      title: 'Proprietary Technologies',
      description: 'Innovative transfection reagents, DNA/RNA engineering methods, and custom service platforms that differentiate us in the market.',
      icon: '🔬'
    },
    {
      title: 'Strategic Partnerships',
      description: 'Collaborations across biotech startups, academic institutions, and pharmaceutical companies.',
      icon: '🤝'
    },
    {
      title: 'Focused Growth Strategy',
      description: 'Expanding our R&D capabilities, service portfolio, and global reach.',
      icon: '🎯'
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
                Investors – BioArk Technologies Investment Opportunities
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Building the future of genetic medicine through strategic partnerships and innovation
              </p>
            </div>
          </div>
        </section>

        {/* Partner With Us Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Partner With Us</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    At BioArk Technologies, we are building the future of genetic medicine for 
                    researchers across therapeutic areas.
                  </p>
                  <p>
                    We are a privately held biotechnology and biopharmaceutical Contract Research 
                    Organization (CRO), specializing in advanced gene editing and gene delivery solutions.
                  </p>
                  <p>
                    We welcome conversations with investors who share our vision and want to be part 
                    of accelerating innovation in life sciences and genetic therapies.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bioark-gradient rounded-2xl transform -rotate-3 opacity-20"></div>
                <div className="relative bg-card p-8 rounded-2xl shadow-lg">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Investment Focus</h3>
                  <p className="text-muted-foreground mb-4">
                    Strategic partnerships that accelerate our mission to advance genetic medicine 
                    and expand our global impact.
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bioark-gradient rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-xs">BA</span>
                    </div>
                    <span className="text-sm font-medium text-foreground">BioArk Technologies</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Invest Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Why Invest in BioArk Technologies?</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Strategic advantages that position us for sustainable growth in the genetic medicine sector
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {investmentHighlights.map((highlight, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{highlight.icon}</div>
                      <CardTitle className="text-xl text-foreground">{highlight.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{highlight.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Investment Philosophy Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Investment Philosophy</h2>
              <Card>
                <CardContent className="p-8">
                  <div className="space-y-4 text-muted-foreground">
                    <p>
                      Although we are a privately held company, we are open to exploring strategic 
                      partnerships and investment opportunities that align with our mission and values.
                    </p>
                    <p>
                      We seek partners who are committed to advancing breakthrough science, fostering 
                      innovation, and driving sustainable growth.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-6">Get in Touch</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                If you are interested in learning more about investment opportunities with BioArk Technologies, 
                please contact us:
              </p>
              
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-xl">Investor Relations</CardTitle>
                  <CardDescription>All inquiries will be handled with strict confidentiality</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                      <span className="font-medium text-foreground">Email:</span>
                      <a href="mailto:support@bioarktech.com" className="text-primary hover:underline">
                        support@bioarktech.com
                      </a>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <span className="font-medium text-foreground">Phone:</span>
                      <a href="tel:1-734-604-2386" className="text-primary hover:underline">
                        1-734-604-2386
                      </a>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <a
                      href="/contact"
                      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-opacity"
                    >
                      Schedule a Confidential Discussion
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Investors;
