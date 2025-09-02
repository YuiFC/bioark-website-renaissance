
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { addQuote } from '@/lib/quotes';
// import { fetchJson } from '@/lib/api';

const RequestQuote = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const form = new FormData(e.currentTarget);
      const payload = {
        firstName: String(form.get('firstName')||''),
        lastName: String(form.get('lastName')||''),
        email: String(form.get('email')||''),
        phone: String(form.get('phone')||''),
        company: String(form.get('company')||''),
        department: String(form.get('department')||''),
        serviceType: String(form.get('serviceType')||''),
        timeline: String(form.get('timeline')||''),
        budget: String(form.get('budget')||''),
        projectDescription: String(form.get('projectDescription')||''),
        additionalInfo: String(form.get('additionalInfo')||''),
  // user snapshot removed (site-wide login disabled)
      };

  // No site-wide login: do not attach user snapshot via /api/me

      await addQuote(payload as any);

      // reset form
      (e.currentTarget as HTMLFormElement).reset();
      toast({
        title: 'Quote Request Submitted',
        description: "We'll get back to you within 24 hours with a detailed quote.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 bioark-hero-gradient">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Request Quote
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Get a customized quote for our products and services tailored to your research needs
              </p>
            </div>
          </div>
        </section>

        {/* Quote Form Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-center">Quote Request Form</CardTitle>
                <CardDescription className="text-center">
                  Please provide detailed information about your project requirements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input id="firstName" name="firstName" required />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input id="lastName" name="lastName" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" name="phone" type="tel" />
                    </div>
                  </div>

                  {/* Organization Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="company">Company/Institution *</Label>
                      <Input id="company" name="company" required />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input id="department" name="department" />
                    </div>
                  </div>

                  {/* Project Details */}
                  <div>
                    <Label htmlFor="serviceType">Service Type *</Label>
                    <Select name="serviceType" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="products">Products</SelectItem>
                        <SelectItem value="cloning">Cloning Services</SelectItem>
                        <SelectItem value="lentivirus">Lentivirus Packaging</SelectItem>
                        <SelectItem value="celllines">Stable Cell Lines</SelectItem>
                        <SelectItem value="experiments">Experiment Services</SelectItem>
                        <SelectItem value="supplies">Lab Supplies</SelectItem>
                        <SelectItem value="custom">Custom Solution</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="timeline">Preferred Timeline</Label>
                      <Select name="timeline">
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="urgent">Urgent (1-2 weeks)</SelectItem>
                          <SelectItem value="standard">Standard (3-4 weeks)</SelectItem>
                          <SelectItem value="flexible">Flexible (1-2 months)</SelectItem>
                          <SelectItem value="planning">Planning phase</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="budget">Budget Range (USD)</Label>
                      <Select name="budget">
                        <SelectTrigger>
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under5k">Under $5,000</SelectItem>
                          <SelectItem value="5k-15k">$5,000 - $15,000</SelectItem>
                          <SelectItem value="15k-50k">$15,000 - $50,000</SelectItem>
                          <SelectItem value="over50k">Over $50,000</SelectItem>
                          <SelectItem value="discuss">Prefer to discuss</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="projectDescription">Project Description *</Label>
                    <Textarea
                      id="projectDescription"
                      name="projectDescription"
                      placeholder="Please describe your project requirements, specific products needed, or services required..."
                      className="min-h-32"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="additionalInfo">Additional Information</Label>
                    <Textarea
                      id="additionalInfo"
                      name="additionalInfo"
                      placeholder="Any additional details, special requirements, or questions..."
                      className="min-h-24"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bioark-gradient text-white hover:opacity-90 transition-opacity"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Contact Info Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-4">Need Immediate Assistance?</h2>
              <p className="text-xl text-muted-foreground">
                Contact our team directly for urgent requests or technical consultations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Phone</h3>
                  <a href="tel:1-734-604-2386" className="text-primary hover:underline">
                    1-734-604-2386
                  </a>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Email</h3>
                  <a href="mailto:support@bioarktech.com" className="text-primary hover:underline">
                    support@bioarktech.com
                  </a>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">Response Time</h3>
                  <p className="text-muted-foreground">Within 24 hours</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default RequestQuote;
