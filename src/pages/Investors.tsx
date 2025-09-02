import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Button } from '@/components/ui/button';
import { CheckCircle, Rocket, ShieldCheck, Layers, Cpu, Dna, Calendar } from 'lucide-react';

const Investors = () => {
  return (
    <Layout>
  <section className="py-20 bioark-hero-gradient border-b">
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
      {/* Part 1: Company Overview & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="md:col-span-5">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Company Overview & Vision</h2>
            <p className="text-muted-foreground mb-4">
              BioArk Technologies is an innovative biotechnology company committed to translating scientific breakthroughs
              into real-world healthcare solutions. We are evolving from a foundational service provider into an integrated
              medical solutions company.
            </p>
            <div className="flex items-start gap-3">
              <Cpu className="w-6 h-6 text-primary mt-0.5" />
              <p className="text-muted-foreground">
                We leverage artificial intelligence (AI) to accelerate service delivery, advance our proprietary platform,
                and drive the creation of next-generation therapies.
              </p>
            </div>
          </div>
          <div className="md:col-span-7 grid grid-cols-2 gap-4">
            <AspectRatio ratio={3/2} className="rounded-xl overflow-hidden bg-muted shadow-lg">
              <img
                src="/images/Investors/Investor-1.jpg"
                alt="CRISPR Trinity and CAR-T concept"
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </AspectRatio>
            <AspectRatio ratio={3/2} className="rounded-xl overflow-hidden bg-muted shadow-lg">
              <img
                src="/images/Investors/Investor-2.jpg"
                alt="Three-tier strategy visual"
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </AspectRatio>
          </div>
        </div>
      </section>

      {/* Part 2: Our Three-Tiered Strategy */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">Our Three-Tiered Strategy</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <CardTitle className="text-xl">Tier I: Solid Foundation</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">Services & Products</p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>AI-assisted molecular cloning and construct design</li>
                <li>High-quality viral packaging (e.g., lentivirus)</li>
                <li>Stable cell line development and validation</li>
                <li>Related gene editing kits and reagents</li>
              </ul>
              <p className="mt-4 text-sm text-muted-foreground">This tier provides a stable revenue base and demonstrates strong technical execution.</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Layers className="w-6 h-6 text-primary" />
                <CardTitle className="text-xl">Tier II: Core Innovation</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">CRISPR Trinity™ Platform (patent-pending)</p>
              <p className="text-muted-foreground mb-3">
                A unified platform designed to integrate diverse CRISPR functions to address complex gene-editing
                requirements in challenging contexts.
              </p>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <Dna className="w-4 h-4 text-primary mt-1" />
                <p><span className="font-medium text-foreground">Business Model:</span> services, licensing, and strategic partnerships.</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Rocket className="w-6 h-6 text-primary" />
                <CardTitle className="text-xl">Tier III: The Future</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2">Universal Bi-CAR-T Therapy</p>
              <p className="text-muted-foreground mb-3">
                Leveraging the CRISPR Trinity Platform to engineer universal Bi-CAR-T cells with dual receptors.
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Addresses high cost and single-target limitations of current CAR-T</li>
                <li>Reduces reliance on patient-derived cells with universal templates</li>
                <li>Primary applications: cancer and immune-related diseases</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Part 3: Development Roadmap & Milestones */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold tracking-tight mb-8 text-center">Development Roadmap & Milestones</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-primary" />
                <CardTitle className="text-xl">Phase 1</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2"><span className="font-medium text-foreground">Goal:</span> CRISPR Trinity product development — a unified platform for complex gene-editing.</p>
              <p className="text-muted-foreground"><span className="font-medium text-foreground">Period & Funding:</span> 1 Year, $300k</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-primary" />
                <CardTitle className="text-xl">Phase 2</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2"><span className="font-medium text-foreground">Goal:</span> Universal Bi-CAR-T research service — engineer universal CAR-T template cells using the platform.</p>
              <p className="text-muted-foreground"><span className="font-medium text-foreground">Period & Funding:</span> 2 Years, $1M</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-primary" />
                <CardTitle className="text-xl">Phase 3</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-2"><span className="font-medium text-foreground">Goal:</span> Therapeutic CAR-T service — translate research into therapeutic applications.</p>
              <p className="text-muted-foreground"><span className="font-medium text-foreground">Period & Funding:</span> 3 Years, $3M</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Part 4: Call to Action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-2xl border bg-card p-8 md:p-12 text-center shadow-sm">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Partner with BioArk</h3>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-6">
            We are seeking visionary partners to shape the future of genetic medicine. If you are interested in our business
            and share our commitment to innovation, we invite you to connect with us.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button asChild size="lg">
              <a href="mailto:investor@bioarktech.com">Contact Investor Relations</a>
            </Button>
            <div className="text-sm text-muted-foreground">investor@bioarktech.com</div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Investors;