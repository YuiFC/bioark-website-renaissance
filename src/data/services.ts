import { customerSolutions, ShowcaseItem } from './showcase';

export interface ServiceDetailData extends ShowcaseItem {
  longDescription: string;
  keyBenefits: string[];
  processOverview: { step: string; description:string }[];
  caseStudies?: { title: string; link: string }[];
  relatedProducts?: { name: string; link: string }[];
}

const allServices: ServiceDetailData[] = [
  {
    ...customerSolutions[0], // Stable Cell Line Generation
    longDescription: 'Our comprehensive stable cell line generation service takes your project from initial vector design and construction to the delivery of fully validated monoclonal cell lines. We handle transfection, selection, and single-cell cloning to ensure the highest quality and stability for your research or bioproduction needs.',
    keyBenefits: [
      'Guaranteed expression levels',
      'Comprehensive validation and QC reports',
      'Royalty-free for commercial use',
      'Fast turnaround times',
    ],
    processOverview: [
      { step: '1. Consultation & Design', description: 'We work with you to design the optimal expression vector for your gene of interest.' },
      { step: '2. Transfection & Selection', description: 'High-efficiency transfection into your chosen host cell line, followed by antibiotic or metabolic selection.' },
      { step: '3. Monoclonal Isolation', description: 'Single-cell cloning using limiting dilution or FACS to isolate high-producing clones.' },
      { step: '4. Validation & Banking', description: 'Clones are expanded, validated for expression and stability, and banked for future use.' },
    ],
    caseStudies: [
      { title: 'Case Study: High-Titer Antibody Production in CHO Cells', link: '/case-studies/cho-antibody' }
    ]
  },
  {
    ...customerSolutions[1], // Custom Viral Vector Production
    longDescription: 'We provide high-quality, ready-to-use viral vectors including lentivirus, AAV, and adenovirus. Our services cover the entire workflow from plasmid construction to large-scale virus production and purification, tailored to your specific in vitro and in vivo applications.',
    keyBenefits: [
      'High-titer and high-purity vectors',
      'Multiple serotypes and custom promoters available',
      'Stringent quality control including titration and sterility testing',
      'Scalable production from research to preclinical grades',
    ],
    processOverview: [
      { step: '1. Vector Construction', description: 'Cloning your gene of interest into our optimized viral vectors.' },
      { step: '2. Small-Scale Production', description: 'Pilot production to optimize conditions and confirm expression.' },
      { step: '3. Large-Scale Production', description: 'Scaling up production to meet your required volume and titer.' },
      { step: '4. Purification & QC', description: 'Advanced purification methods followed by comprehensive quality control assays.' },
    ],
  },
  {
    ...customerSolutions[2], // Assay Development & Screening
    longDescription: 'Our team develops and validates robust, high-throughput assays for your screening campaigns. We specialize in a variety of formats, including cell-based assays, biochemical assays, and immunoassays, providing reliable data to accelerate your drug discovery pipeline.',
    keyBenefits: [
      'Custom assay design tailored to your target',
      'Broad range of detection technologies (e.g., luminescence, fluorescence)',
      'Full validation according to industry standards (Z\', S/B ratio)',
      'Seamless transition to high-throughput screening (HTS)',
    ],
    processOverview: [
      { step: '1. Feasibility Study', description: 'Assessing the target and selecting the best assay format and technology.' },
      { step: '2. Assay Optimization', description: 'Fine-tuning parameters like reagent concentration and incubation times for optimal performance.' },
      { step: '3. Validation', description: 'Rigorous testing of the assay for robustness, reproducibility, and accuracy.' },
      { step: '4. Screening/Deployment', description: 'Executing the screening campaign or transferring the validated protocol to your lab.' },
    ],
  },
  {
    ...customerSolutions[3], // Target Identification & Validation
    longDescription: 'Leverage our cutting-edge CRISPR screening platform to identify and validate novel drug targets in your disease model of interest. We offer both pooled and arrayed screens for gain-of-function and loss-of-function studies, providing actionable insights for your R&D programs.',
    keyBenefits: [
      'Genome-wide and custom library screening',
      'In-depth bioinformatics analysis and hit identification',
      'Orthogonal validation of primary hits',
      'Expert consultation on experimental design',
    ],
    processOverview: [
      { step: '1. Library Selection & Cell Line Prep', description: 'Choosing the right CRISPR library and preparing the cell model for screening.' },
      { step: '2. Screen Execution', description: 'Transduction with the CRISPR library and application of selective pressure.' },
      { step: '3. Next-Generation Sequencing (NGS)', description: 'Sequencing of the screen output to determine guide RNA enrichment or depletion.' },
      { step: '4. Data Analysis & Hit Prioritization', description: 'Bioinformatic analysis to identify statistically significant hits and prioritize targets for validation.' },
    ],
  },
];

export const getServiceBySlug = (slug: string): ServiceDetailData | undefined => {
  return allServices.find(s => s.link === `/services/${slug}`);
};