
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const FeaturedSections = () => {
  const sections = [
    {
      title: 'Featured Products',
      description: 'Advanced transfection reagents, molecular markers, and genome editing solutions designed for precision research.',
      items: ['BAPoly® Transfection Reagent', '2 × Fast SYBR Green qPCR Master Mix', 'Prestained Protein Markers'],
      link: '/products',
      gradient: 'from-primary to-accent'
    },
    {
      title: 'Gene Editing Products',
      description: 'Comprehensive genome editing tools for targeted modifications, knock-ins, knock-outs, and RNA interference.',
      items: ['Targeted Knock-In', 'Gene Knock-Out', 'RNA Knock-Down'],
      link: '/products',
      gradient: 'from-accent to-secondary'
    },
    {
      title: 'Custom Solutions',
      description: 'Tailored molecular services including cloning, viral packaging, and stable cell line development.',
      items: ['Cloning Services', 'Lentivirus Packaging', 'Stable Cell Lines'],
      link: '/services',
      gradient: 'from-secondary to-primary'
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Accelerating Genetic Medicine
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From research-grade reagents to custom molecular services, we provide the tools and expertise 
            to advance your genetic research and therapeutic development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sections.map((section, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${section.gradient} mb-4 flex items-center justify-center`}>
                  <div className="w-6 h-6 bg-white/30 rounded-full" />
                </div>
                <CardTitle className="text-xl text-foreground">{section.title}</CardTitle>
                <CardDescription className="text-muted-foreground">
                  {section.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                      {item}
                    </li>
                  ))}
                </ul>
                <Button asChild variant="ghost" className="w-full group-hover:bg-primary/5 group-hover:text-primary">
                  <Link to={section.link} className="flex items-center justify-center">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedSections;
