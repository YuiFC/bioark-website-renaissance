
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="py-20 bioark-hero-gradient">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                About Us – BioArk Technologies Leadership & Mission
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Advancing genetic medicine through scientific excellence and collaborative partnership
              </p>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">About Us</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Our scientists, engineers, and project managers bring decades of combined expertise 
                    in molecular biology, synthetic biology, and biopharmaceutical R&D.
                  </p>
                  <p>
                    We are committed to scientific excellence, transparency, and collaborative partnership 
                    to help our clients achieve their goals faster.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bioark-gradient rounded-2xl transform rotate-3 opacity-20"></div>
                <div className="relative bg-card p-8 rounded-2xl shadow-lg">
                  <h3 className="text-xl font-semibold text-foreground mb-4">Our Mission</h3>
                  <p className="text-muted-foreground">
                    To accelerate discoveries and advance genetic medicine through innovative 
                    gene editing and delivery solutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Meet Our Team</h2>
              <p className="text-xl text-muted-foreground">
                Leadership driving innovation in genetic medicine
              </p>
            </div>

            <Card className="max-w-4xl mx-auto">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img 
                      src="/lovable-uploads/78c14c39-6124-4d30-abab-1b43b3ed603f.png" 
                      alt="Dr. Lipeng Wu"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-2xl">Lipeng Wu, Ph.D.</CardTitle>
                    <CardDescription className="text-lg">Co-Founder and CEO</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  Dr. Lipeng Wu is the Co-Founder and CEO of BioArk Technologies, a pioneering biotech 
                  company advancing gene editing solutions from research to real-world therapies. With 
                  over 20 years of experience in cancer biology, CRISPR engineering, and product 
                  development, Dr. Wu has built a career at the intersection of science and innovation. 
                  He holds a Ph.D. in Biochemistry and Molecular Biology from Peking University Health 
                  Science Center, where he earned national recognition for his work in epigenetic drug 
                  discovery. Passionate about transforming cutting-edge science into impactful healthcare solutions.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Company Details Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">About BioArk Technologies</h2>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-8">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    BioArk Technologies is a biotechnology and biopharmaceutical CRO specializing in 
                    gene editing and delivery. Using proprietary platforms, our team engineers DNA and 
                    RNA to support research across therapeutic areas such as immunology, oncology, and 
                    neuroscience. We offer comprehensive molecular services, viral packaging, and stable 
                    cell line development to help accelerate discoveries and advance genetic medicine.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
