
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Cpu, Dna, FlaskConical, ShieldCheck } from 'lucide-react';

const About = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Hero Section with brand gradient (no background image) */}
        <section className="py-20 bioark-hero-gradient border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Why BioArk</h1>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">Innovating genome engineering for real-world impact</p>
          </div>
        </section>

        {/* Who We Are */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-8">Who We Are</h2>
            <div className="grid md:grid-cols-3 gap-10 items-start">
              {/* Left: full copy */}
              <div className="md:col-span-2 space-y-5 text-muted-foreground leading-relaxed text-[17px]">
                <p>BioArk Technologies, established in January 2025 in Rockville, Maryland, is an innovative biotechnology company dedicated to transforming groundbreaking scientific discoveries into practical solutions. Our mission is to advance genome engineering and accelerate its clinical and translational applications.</p>
                <p>We provide a comprehensive suite of services—including molecular cloning, viral packaging, and stable cell line development—designed to accelerate progress in gene editing. By integrating advanced AI technologies, we deliver streamlined, customized solutions that enhance efficiency and improve overall customer experience.</p>
                <p>Our proprietary CRISPR Trinity Platform addresses complex genetic editing challenges and offers unique advantages in the development of universal CAR-T therapies and related applications. These capabilities are available through specialized services, licensing opportunities, and strategic partnerships.</p>
                <p>By bridging cutting-edge research with clinical application, BioArk Technologies is committed to transforming pioneering scientific discoveries into real-world healthcare solutions.</p>
              </div>
              {/* Right: key highlights with icons */}
              <div className="grid gap-4">
                <div className="flex items-start gap-3 rounded-xl border bg-card p-4 shadow-sm">
                  <div className="mt-0.5 text-primary"><Building2 className="h-5 w-5" /></div>
                  <div>
                    <div className="font-semibold">Founded 2025 • Rockville, MD</div>
                    <p className="text-sm text-muted-foreground">Established to advance genome engineering into real-world applications.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border bg-card p-4 shadow-sm">
                  <div className="mt-0.5 text-primary"><FlaskConical className="h-5 w-5" /></div>
                  <div>
                    <div className="font-semibold">Comprehensive gene editing services</div>
                    <p className="text-sm text-muted-foreground">Molecular cloning, viral packaging, stable cell line development.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border bg-card p-4 shadow-sm">
                  <div className="mt-0.5 text-primary"><Dna className="h-5 w-5" /></div>
                  <div>
                    <div className="font-semibold">Proprietary CRISPR Trinity Platform</div>
                    <p className="text-sm text-muted-foreground">Designed for complex editing and universal CAR-T strategies.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border bg-card p-4 shadow-sm">
                  <div className="mt-0.5 text-primary"><Cpu className="h-5 w-5" /></div>
                  <div>
                    <div className="font-semibold">AI-enhanced, tailored solutions</div>
                    <p className="text-sm text-muted-foreground">Streamlined workflows for efficiency and better experiences.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-xl border bg-card p-4 shadow-sm">
                  <div className="mt-0.5 text-primary"><ShieldCheck className="h-5 w-5" /></div>
                  <div>
                    <div className="font-semibold">Clinical & translational focus</div>
                    <p className="text-sm text-muted-foreground">Bridging cutting-edge research with practical healthcare solutions.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">Meet our Team</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Dr. Lipeng Wu */}
              <TeamCard
                avatarSrc="/images/about/Headshot-1-Lipeng-300x300.jpg"
                name="Dr. Lipeng Wu"
                title="Founder & CEO"
                intro1="Dr. Lipeng Wu is the Founder & CEO of BioArk Technologies, an innovative biotechnology company established in Rockville, Maryland in 2025, specializing in gene editing services and the proprietary CRISPR-Trinity platform. With over 21 years of research experience in molecular biology, cell biology, and cancer biology across both academic and industry settings, he brings deep expertise in genome engineering, viral vector systems, and CAR-T therapy development."
                intro2="Dr. Wu’s career bridges both academic research and the biotechnology industry. He held research fellowships at the NIH and the University of Michigan, where he published multiple high-impact papers in Molecular Cell and Molecular and Cellular Biology on epigenetics and chromatin biology. He later served as Senior Scientist and Product Manager at Origene Technologies, where he led the development of advanced CRISPR technologies including base editing and prime editing, as well as viral vector production and stable cell line platforms."
                intro3="Today, Dr. Wu leverages his expertise in CRISPR genome editing, molecular cloning, viral vector design, stable cell line engineering, and AI-driven biotechnology to lead BioArk Technologies. As a scientific innovator and business leader, he has directed research teams, product pipelines, and strategic partnerships to bridge fundamental discoveries with real-world healthcare solutions."
              />

              {/* Dr. Jingwen Xu */}
              <TeamCard
                avatarSrc="/images/about/Jingwen-Xu-HeadShot.jpg"
                name="Dr. Jingwen Xu"
                title="Co-Founder & Chief Operating Officer"
                intro1="Dr. Jingwen Xu, M.D., M.Sc., Ph.D., is a physician-scientist, entrepreneur, and biotechnology executive with over three decades of experience in clinical medicine, molecular biology, and translational research. He is the Co-Founder and Chief Operating Officer of BioArk Technologies and also serves as Chief Executive Officer of EGFIE, a company specializing in the marketing and distribution of molecular laboratory consumables, kits, reagents, and equipment."
                intro2="Dr. Xu completed his postdoctoral research at the University of Helsinki, focusing on biomedicine and orthopaedics. He then served as a Senior Research Scientist at the Albert Einstein College of Medicine, where he conducted studies in rheumatology, oncology, and molecular signaling pathways. He later joined Georgetown University as an Instructor and Assistant Professor, advancing research in molecular biology and immunology."
                intro3="In addition to his academic appointments, Dr. Xu has held leadership roles in both research and industry. As CEO of Himalayan Biotech and later EGFIE, he has successfully bridged scientific innovation with business development. At BioArk Technologies, he plays a pivotal role in advancing next-generation CRISPR-based platforms and CAR-T therapeutic strategies, integrating laboratory management expertise with commercial strategy."
                intro4="Today, Dr. Xu combines deep scientific expertise with entrepreneurial leadership to drive innovation at the intersection of biotechnology, clinical application, and commercial development."
              />

              {/* Dr. Mei Sun */}
              <TeamCard
                avatarSrc="/images/about/Mei-Sun.jpeg"
                name="Dr. Mei Sun"
                title="Advisor (Neurosensory R&D, Government Funding & Commercialization)"
                intro1="Dr. Mei Sun is an accomplished professional in the field of neurosensory research and development, with extensive leadership experience in government biomedical research and technology commercialization."
                intro2="Most recently, in 2025 Dr. Sun founded Heyma Consulting LLC, a firm dedicated to helping startups and established companies pursue government funding opportunities, including DoD, NIH, NSF, and state-level programs. Through this venture, she provides strategic guidance on securing SBIR, OTA, and BAA funding, as well as commercialization strategy and proposal development."
                intro3="In 2024, Dr. Sun served as Program Manager at the Defense Health Agency (DHA), where she oversaw the Sensory Program, a Department of Defense research portfolio advancing innovations in sensory injury prevention, diagnostics, and treatment. Prior to this role, Dr. Sun was the Neurosensory Portfolio Manager at the US Army Medical Research and Development Command (USMRDC), where she managed Science & Technology funding for a broad range of neurosensory research projects. She also held the role of Program Manager for the Congressionally Directed Medical Research Program’s (CDMRP) Other Transaction Authority (OTA) program, where she facilitated the entire funding cycle—from solicitation announcements through post-award management—enhancing collaboration between agencies and advancing critical research."
                intro4="Dr. Sun’s expertise extends beyond neurosensory research. From 2017 to 2019, she served as Portfolio Manager for the Medical Simulation and Information Sciences Research Program (MSISRP), managing an annual budget of over twenty million dollars in science and technology funding, and leading collaborations across DoD commands, government agencies, academia, and industry. From 2014 to 2017, Dr. Sun was Senior Scientist and Principal Investigator at the US Army Medical Research Institute of Infectious Diseases (USAMRIID). Earlier in her career, she was a research scientist at the Janelia Research Campus, HHMI (2010–2014), and completed her post-doctoral training at Genentech, Inc. (2008–2010). Dr. Sun earned her PhD in Biology and MBA in Management from UCSD in 2007 and trained with renowned scientists including Nobel laureates Dr. Roger Tsien and Dr. Eric Betzig, contributing to 20+ publications in Science, Nature Cell Biology, Nature Methods, and Nature Microbiology. Beyond her professional career, Dr. Sun serves on the Board of Directors of FITCI, a leading biotech incubator in Frederick, Maryland."
              />
            </div>
          </div>
        </section>
        {/* End */}
      </div>
    </Layout>
  );
};

type TeamCardProps = {
  avatarSrc: string;
  name: string;
  title: string;
  intro1: string;
  intro2?: string;
  intro3?: string;
  intro4?: string;
};

const TeamCard: React.FC<TeamCardProps> = ({ avatarSrc, name, title, intro1, intro2, intro3, intro4 }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
            <img src={avatarSrc} alt={name} className="w-full h-full object-cover" />
          </div>
          <div>
            <CardTitle className="text-2xl">{name}</CardTitle>
            <CardDescription className="text-base">{title}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Collapsed: show only first paragraph (clamped to ~3 lines). Expanded: show all */}
        <div className="text-muted-foreground leading-relaxed text-[16px]">
          <p className={!expanded ? 'line-clamp-3' : ''}>{intro1}</p>
          {expanded && (
            <>
              {intro2 && <p className="mt-4">{intro2}</p>}
              {intro3 && <p className="mt-4">{intro3}</p>}
              {intro4 && <p className="mt-4">{intro4}</p>}
            </>
          )}
        </div>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 text-primary hover:underline text-sm font-medium"
          aria-expanded={expanded}
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
      </CardContent>
    </Card>
  );
};

export default About;
