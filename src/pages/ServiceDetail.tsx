import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { getServiceBySlug } from '@/data/services';
import NotFound from './NotFound';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = slug ? getServiceBySlug(slug) : undefined;

  if (!service) {
    return <NotFound />;
  }

  const Icon = service.icon;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {service.name}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Customer Solution
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-8">
            {service.markdown ? (
              <Card>
                <CardHeader>
                  <CardTitle>Service Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-neutral max-w-none prose-headings:scroll-mt-24 prose-h2:mt-8 prose-h3:mt-6 prose-p:leading-relaxed"
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{service.markdown}</ReactMarkdown>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Service Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      {service.longDescription}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Process Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="relative border-l border-border ml-2">
                      {service.processOverview.map((item, index) => (
                        <li key={index} className="mb-10 ml-8">
                          <span className="absolute flex items-center justify-center w-8 h-8 bg-primary/20 rounded-full -left-4 ring-8 ring-background">
                            <span className="text-primary font-bold">{index + 1}</span>
                          </span>
                          <h3 className="font-semibold text-foreground">{item.step}</h3>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Right Column: Key Benefits & CTA */}
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Key Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {service.keyBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-primary/5 sticky top-24">
              <CardHeader>
                <CardTitle>Ready to Start?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Contact us today to discuss your project with one of our specialists.
                </p>
                <Button asChild className="w-full bioark-btn-primary">
                  <Link to="/request-quote">Request a Quote</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServiceDetail;