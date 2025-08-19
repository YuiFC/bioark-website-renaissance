
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import Map from '@/components/Map';

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll respond within 24 hours.",
      });
    }, 1000);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 bioark-hero-gradient">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Contact Us
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Get in touch with our team for any questions, support, or collaboration opportunities
              </p>
            </div>
          </div>
        </section>

        {/* Contact Information and Form */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Information */}
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-8">Get in Touch</h2>
                
                <div className="space-y-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-foreground mb-4 flex items-center">
                        <span className="w-8 h-8 bioark-gradient rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-xs">📞</span>
                        </span>
                        Phone
                      </h3>
                      <a href="tel:1-734-604-2386" className="text-primary hover:underline text-lg">
                        1-734-604-2386
                      </a>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-foreground mb-4 flex items-center">
                        <span className="w-8 h-8 bioark-gradient rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-xs">✉️</span>
                        </span>
                        Email
                      </h3>
                      <a href="mailto:support@bioarktech.com" className="text-primary hover:underline text-lg">
                        support@bioarktech.com
                      </a>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-foreground mb-4 flex items-center">
                        <span className="w-8 h-8 bioark-gradient rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-xs">📍</span>
                        </span>
                        Address
                      </h3>
                      <address className="text-muted-foreground not-italic mb-4">
                        13 Taft, Suite 213<br />
                        Rockville, MD, 20850<br />
                        United States
                      </address>
                      <Map />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-foreground mb-4 flex items-center">
                        <span className="w-8 h-8 bioark-gradient rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-xs">⏱️</span>
                        </span>
                        Response Time
                      </h3>
                      <p className="text-muted-foreground">
                        We typically respond within 24 hours during business days
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Contact Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Send us a Message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you as soon as possible
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
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

                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" name="email" type="email" required />
                      </div>

                      <div>
                        <Label htmlFor="company">Company/Institution</Label>
                        <Input id="company" name="company" />
                      </div>

                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Select name="subject" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="products">Product Information</SelectItem>
                            <SelectItem value="services">Service Information</SelectItem>
                            <SelectItem value="technical">Technical Support</SelectItem>
                            <SelectItem value="partnership">Partnership Opportunity</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Please describe your inquiry or question..."
                          className="min-h-32"
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bioark-gradient text-white hover:opacity-90 transition-opacity"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Sending...' : 'Send Message'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-muted-foreground">
                Quick answers to common questions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {[
                {
                  question: "What is your typical turnaround time?",
                  answer: "Turnaround times vary by service. Standard projects typically take 2-4 weeks, while urgent requests can often be accommodated within 1-2 weeks."
                },
                {
                  question: "Do you offer custom services?",
                  answer: "Yes, we specialize in custom molecular solutions tailored to your specific research needs. Contact us to discuss your requirements."
                },
                {
                  question: "What therapeutic areas do you support?",
                  answer: "We support research across immunology, oncology, neuroscience, and other therapeutic areas with our gene editing and delivery solutions."
                },
                {
                  question: "How do I request a quote?",
                  answer: "You can request a quote through our dedicated quote request form or by contacting us directly with your project details."
                }
              ].map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Contact;
