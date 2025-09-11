import { ShowcaseItem } from './showcase';

export interface ServiceDetailData extends ShowcaseItem {
  longDescription: string;
  keyBenefits: string[];
  processOverview: { step: string; description:string }[];
  caseStudies?: { title: string; link: string }[];
  relatedProducts?: { name: string; link: string }[];
  markdown?: string; // Optional rich content for services that provide full-page details
  createdAt?: number; // Optional timestamp for Admin-added items
}

const allServices: ServiceDetailData[] = [
  // 1) Custom Cloning Services
  {
    id: 'svc-01',
    name: 'Custom Cloning Services',
    description: 'End-to-end plasmid design, cloning, synthesis, and delivery with collaborative web-based design.',
    link: '/services/custom-cloning',
    longDescription: 'Comprehensive plasmid construction services with collaborative design to fit your exact research needs.',
    keyBenefits: [
      'Custom plasmid design tailored to your research',
      'Advanced cloning technologies and expert team',
      'Streamlined, efficient workflows',
      'Web platform for collaborative design review',
    ],
    processOverview: [
      { step: 'Project Intake', description: 'We align on goals, vector backbones, promoters, tags, and constraints.' },
      { step: 'Design & Review', description: 'In-silico design and web-based review/approval.' },
      { step: 'Build & QC', description: 'Fragment synthesis/subcloning, assembly, and quality control.' },
      { step: 'Delivery', description: 'Plasmid preparation, optional endotoxin-free prep, normalization, and shipment.' },
    ],
    markdown: `At BioArk Technologies, we offer comprehensive plasmid construction services designed for molecular biology and genetics research. Our intuitive web platform lets you collaborate in real time to ensure vectors fit your exact specifications.

## Why Choose Our Vector Cloning Service?
- Custom Plasmid Design — Tailored to your specific research needs
- Advanced Technologies — Leveraging technical expertise and innovative solutions
- Efficient Process — Streamlined for fast and reliable results
- Customer Collaboration — Web-based platform for seamless design involvement

Contact us: support@bioarktech.com

## Service Offerings
### Comprehensive Project Support
Assist in vector design (backbone, promoter, insertion sites, tags) tailored to your project.

### Subcloning Service
Adapt your vector to viral systems (lentivirus, dual promoter, inducible, CRISPR platforms).

### Fragment Synthesis and Cloning
High-quality fragment synthesis at competitive prices; we clone into custom or BioArk vectors.

### Plasmid Delivery and Expression
Downstream services including lentivirus packaging and stable cell line development.

## Plasmid Construction Services — Pricing
| Service | Catalog Number | Price | Time |
| --- | --- | --- | --- |
| Subcloning Services | PCSVC02 | $199 | 2 weeks |
| Fragment synthesis & Cloning | PCSVC03 | Pricing Policy Details Below | 2–3 weeks |
| Custom Cloning Project | PCSVC04 | Above pricing + Project Fee ($200–$1000) | > 3 weeks |

## Synthesis & Cloning Pricing
| Synthesis & Cloning | <60bp | 60bp–0.5kb | 0.5kb–3kb | 3kb–5kb |
| --- | --- | --- | --- | --- |
| BioArk Vectors | $120/seq | $150/seq | $0.2/bp | $0.24/bp |
| Custom Vector | $120/seq | $150/seq | $0.24/bp | $0.28/bp |

## Plasmid Services
| Scale | 2 µg – 10 µg | 10 µg–50 µg | 50 µg–300 µg | 300 µg–1 mg |
| --- | --- | --- | --- | --- |
| Plasmid Scale | Included | $30.00/seq | $90.00/seq | $150.00/seq |
| Endotoxin Free (<0.1 EU/µg) | - | $20.00 per seq | $50.00 per seq | $50.00 per seq |
| DNA Normalization | $15.00 per seq | $15.00 per seq | $15.00 per seq | $15.00 per seq |
| Glycerol Stock | $10.00 per seq | $10.00 per seq | $10.00 per seq | $10.00 per seq |
`
  },

  // 2) Genome Editing Services (new; full content markdown)
  {
    id: 'svc-02',
    name: 'Genome Editing Services',
    description: 'CRISPR overexpression, knockout, RNA knockdown, and ready-to-use kits for streamlined editing.',
    link: '/services/genome-editing',
    longDescription: 'Comprehensive genome editing solutions including targeted overexpression, CRISPR knock-out, RNA knockdown, and turnkey kits with delivery options.',
    keyBenefits: [
      'Precise knock-in at safe harbor or locus-specific sites',
      'High-efficiency CRISPR knock-out with minimized off-targets',
      'CRISPR-based RNA knockdown for superior specificity',
      'Kits with success guarantee and rapid turnaround',
    ],
    processOverview: [
      { step: 'Consultation', description: 'Discuss goals, targets, and editing strategy (overexpression/KO/RNA KD).' },
      { step: 'Design', description: 'gRNA, donor template, and vector design optimized for your cell line.' },
      { step: 'Build & QC', description: 'Construct assembly, validation, and functional checks.' },
      { step: 'Delivery', description: 'Plasmid or lentivirus delivery with documentation and support.' },
    ],
    markdown: `## Targeted Overexpression with CRISPR
Our targeted overexpression service allows for the precise and controlled expression of your gene of interest at specific genomic loci, including safe harbor sites like AAVS1. Compared with Lentivirus induced overexpression, targeted overexpression can provide more precision regulation and more safety and controllable knock-in effects. This service is ideal for:

- Inducible or constitutive overexpression of target genes
- Ensuring high-level, stable expression in your cell line
- Requiring more accurate regulations, including inducible promoters.

## CRISPR Knock-Out
We employ an optimized CRISPR-Cas9 system along with precisely designed guide RNAs (gRNAs) to achieve high knockout efficiency in both adherent and cancer cell lines. Our tailored knockout strategies are customized to meet your specific experimental requirements, ensuring reliable and reproducible results. Our services target a broad range of genomic loci, from exonic regions to safe harbor sites, minimizing off-target effects. We also provide thorough validation of knockout efficiency through genomic and expression analyses, including PCR, sequencing, and Western blotting.

**Available in two formats:** lentivirus and standard plasmids  
**Custom-designed guide RNAs (gRNAs)** for maximum knockout efficiency  
**Ideal for** functional genomics and pathway analysis

## CRISPR RNA Knockdown
We offer CRISPR-based RNA knockdown services that specifically target and degrade RNA transcripts, effectively reducing the expression of your gene of interest at the transcriptional level. Compared to traditional RNA interference (RNAi), CRISPR RNA technologies generally provide more efficient knockdown and greater target specificity.

- Efficient RNA degradation using CRISPR/Cas13 technology
- Ideal for high-throughput screening and gene function analysis
- Offers a more dynamic and precise approach to gene silencing than conventional methods

## Genome Editing Kits

### Targeted Overexpression Plasmid Kit

Catalog: (CDS-P011k) — $899 — 2–3 weeks

Transform your research with our innovative tool to integrate your interest genes into the safe harbor site AAVS1. Our targeted overexpression kit is optimized for use in various cancer cell lines, achieving a remarkable success rate in establishing stable cell lines.

**Your Success is Our Commitment!**  
We guarantee that our kit will successfully generate stable overexpression clones in your transfectable cell lines. If it doesn’t work, you’ll receive a full refund.

For additional services related to stable cell lines, please reach out to us at support@BioArkTech.com.

### CRISPR Knock-Out Plasmid Kit

Catalog: (COT-P031k) — $790 — 2–3 weeks

Our knockout kit offers a fast and efficient solution to disrupt target genes in various cell lines, facilitating the creation of stable cell lines. It includes three all-in-one plasmids featuring optimized Cas9, gRNA structures, and selection markers for improved gene knockout efficiency.

**Guaranteed Success!**  
We guarantee that our kit will successfully generate stable knockout clones in your transfectable cell lines. If it doesn’t work, you’ll receive a full refund.

For additional services related to stable cell lines, please get in touch with us at support@BioArkTech.com.

### CRISPR Knock-Out Lentivirus Kit

Catalog: (COM-P032k) — $1,499 — 2–3 weeks

Our knockout lentivirus kit harnesses advanced lentivirus technology to deliver all-in-one CRISPR knockout functional cassettes, expanding your applications across a broader range of cell lines. The kit includes a single tube of virus with three mixed gRNA sequences, streamlining your experimental process.

**Guaranteed Results!**  
We guarantee that our kit will successfully generate stable knockout clones in your transfectable cell lines. If it doesn’t work, you’ll receive a full refund.

For additional services related to stable cell lines, please contact us at support@BioArkTech.com.

### CRISPR RNA Knock-Down Plasmid Kit

Catalog: (CRT-P051k) — $790 — 2–3 weeks

Our CRISPR RNA knockdown kits offer a highly specific and powerful alternative to traditional RNAi methods for reducing RNA expression levels. Achieve effective inhibition of target gene RNA levels by over 70% across a wide range of applications.

**Guaranteed Efficiency!**  
We stand by our promise: our kit will efficiently inhibit your target genes in transfectable cell lines. If it doesn’t work, you’ll receive a full refund.

For any inquiries, please contact us at support@BioArkTech.com.
`
  },


  // 3) Lab Supplies
  {
    id: 'svc-03',
    name: 'Lab Supplies',
    description: 'High-quality reagents and kits for cloning, virus packaging, and stable cell line development.',
    link: '/services/lab-supplies',
    longDescription: 'Quality reagents and kits with expert technical support to ensure reliable, reproducible results.',
    keyBenefits: [
      'High-performance reagents',
      'Competitive pricing',
      'Expert technical support',
    ],
    processOverview: [
      { step: 'Inquiry', description: 'Tell us your application and requirements.' },
      { step: 'Recommendation', description: 'We propose suitable products and bundles.' },
      { step: 'Fulfillment', description: 'Rapid delivery with documentation.' },
      { step: 'Support', description: 'Post-purchase technical assistance as needed.' },
    ],
    markdown: `At BioArk Technologies, we supply reagents and kits to support molecular cloning, virus packaging, and stable cell line development.

### Reagents
| Class | Cat No (Order Link) | Product Name |
| --- | --- | --- |
| Transfection | BAL100668 | BAJet® In Vitro DNA Transfection Reagent |
| Transfection | BAL100468 | BioArkLipo® In Vitro Transfection Kit (Ver. II) |
| Transfection | BAL100688 | BAPoly® In Vitro DNA Transfection Reagent |
| qPCR | BSY3320 | 2 × SYBR Green qPCR Master Mix |
| qPCR | BSY3323 | 2 × Fast SYBR Green qPCR Master Mix |
| DNA Marker | BADM3362 | GN8K DNA Marker (100–8000 bp) |
| DNA Marker | BADM3363 | GN10K DNA Marker (300–10000 bp) |
| DNA Marker | BADM3364 | GN15K DNA Marker (500–15000 bp) |
| Protein Marker | BAPM2083 | Prestained Protein Marker IV (8–200 kDa) |
| Protein Marker | BAPM2086 | Western Protein Marker I (Exposure) |

We also partner with Pakgent, Servicebio, and EGFIE to offer consumables, instruments, and reagents across molecular, cellular, immunology, and pathology research. Distributors welcome — contact support@bioarktech.com.
`
  },

  // 4) Lentivirus Packaging Services
  {
    id: 'svc-04',
    name: 'Lentivirus Packaging Services',
    description: 'High-titer, ready-to-use lentiviral vectors with full QC and optional functional testing.',
    link: '/services/lentivirus-packaging',
    longDescription: 'End-to-end lentivirus design, packaging, purification, and validation for gene expression, knockdown, and CRISPR editing.',
    keyBenefits: [
      'High transduction efficiency with low cytotoxicity',
      'Batch-to-batch consistency and comprehensive QC',
      'Optional functional assays for tagged/untagged proteins',
    ],
    processOverview: [
      { step: 'System Selection', description: 'Choose 2nd-gen (3-plasmid) or 3rd-gen (4-plasmid) systems.' },
      { step: 'Subcloning', description: 'MiniGFP (~330 bp) tags or selection markers (Puro/BSD/Neo, etc.).' },
      { step: 'Packaging & QC', description: 'Optimized production with titer, purity, and functionality checks.' },
      { step: 'Delivery', description: 'Shipped on dry ice with documentation.' },
    ],
    markdown: `### Technology Background
**2nd Generation (Three-Plasmid):** Transfer, Packaging (Gag/Pol/Rev), Envelope.  
**3rd Generation (Four-Plasmid):** Transfer, Gag/Pol, Rev, Envelope — safer but typically lower titer (default).

### Service Offerings
1. Project Support — System selection and construct customization.  
2. Lentivirus Subcloning — MiniGFP (~330 bp) or selection markers (Puro/BSD/Neo, custom).  
3. Lentivirus Packaging — Optimized yield and purity; full QC.  
4. Functional Testing — qPCR, fluorescence, immunofluorescence, Western blot (custom).

### Pricing
| Catalog Number | Minimum Titer | Volume | 1st Tube Price | 2nd Tube Price | Turnaround |
| --- | --- | --- | --- | --- | --- |
| LPSVC-mini | >10^7 TU/ml | 200 µl | $199 | $199 | 2–3 weeks |
| LPSVC-midi | >10^8 TU/ml | 200 µl | $399 | $399 | 2–3 weeks |
| LPSVC-maxi | >10^9 TU/ml | 200 µl | $699 | $699 | 2–3 weeks |

### Functional Services (Add-ons)
| Titer and Functional Service | Price | Note |
| --- | --- | --- |
| qPCR | - | Optimized RT‑qPCR quantifies lentiviral RNA |
| Fluorescent Tag Analysis | +$50 | HEK293T infection and imaging (GFP/RFP/BFP, etc.) |
| Protein Tag Analysis (IF) | +$70 | Immunofluorescence for Myc/His/Flag or custom tags |
| Customized Testing (WB) | +$120 | Western blot; customer provides primary antibody |

### Subcloning & Analysis
| Service | Price | Note |
| --- | --- | --- |
| Lenti‑miniGFP Subcloning & Fluorescence | +$199 | Transfer gene to miniGFP construct; HEK293T infection/analysis |
| Lenti Selection Subcloning | +$189 | Transfer to selection constructs (Puro/BSD/Neo or custom) |

Contact: support@bioarktech.com
`
  },

  // 5) Stable Cell Line Services (kept with structured overview)
  {
    id: 'svc-05',
    name: 'Stable Cell Line Services',
    description: 'From vector design to monoclonal selection, validation, and banking.',
    link: '/services/cell-line-generation',
    longDescription: 'Comprehensive stable cell line generation from vector design and construction to fully validated monoclonal cell lines.',
    keyBenefits: [
      'Guaranteed expression levels',
      'Comprehensive validation and QC reports',
      'Royalty-free for commercial use',
      'Fast turnaround times',
    ],
    processOverview: [
      { step: 'Consultation & Design', description: 'Optimal vector design for your gene of interest.' },
      { step: 'Transfection & Selection', description: 'High-efficiency delivery followed by antibiotic/metabolic selection.' },
      { step: 'Monoclonal Isolation', description: 'Single-cell cloning via limiting dilution or FACS.' },
      { step: 'Validation & Banking', description: 'Expression/stability validation and cell banking.' },
    ],
  },
];

// Local override/custom support (Admin Portal)
const readOverrides = (): Record<string, Partial<ServiceDetailData>> => {
  try { return JSON.parse(localStorage.getItem('bioark_services_overrides')||'{}'); } catch { return {}; }
};
const readCustom = (): ServiceDetailData[] => {
  try { return JSON.parse(localStorage.getItem('bioark_services_custom')||'[]'); } catch { return []; }
};

const applyOverrides = (s: ServiceDetailData, ov: Record<string, Partial<ServiceDetailData>>): ServiceDetailData => ({
  ...s,
  ...(ov[s.id]||{})
});

export const getAllServices = (): ServiceDetailData[] => {
  const ov = readOverrides();
  const baseApplied = allServices.map(s => applyOverrides(s, ov));
  const custom = readCustom();
  return [...baseApplied, ...custom];
};

function normalizeServiceLink(link: string | undefined): string | undefined {
  if (!link) return undefined;
  let s = String(link).trim();
  if (!s.startsWith('/')) s = '/' + s;
  if (s.length > 1 && s.endsWith('/')) s = s.slice(0, -1);
  if (!s.startsWith('/services/')) {
    if (s.includes('/services/')) {
      const i = s.indexOf('/services/');
      s = s.slice(i);
    } else {
      s = '/services/' + s.replace(/^\/+/, '');
    }
  }
  return s.toLowerCase();
}

function extractServiceSlug(link: string | undefined): string | undefined {
  const norm = normalizeServiceLink(link);
  if (!norm) return undefined;
  const idx = norm.indexOf('/services/');
  if (idx < 0) return undefined;
  const tail = norm.slice(idx + '/services/'.length);
  return tail || undefined;
}

export const getServiceBySlug = (slug: string): ServiceDetailData | undefined => {
  const all = getAllServices();
  const slugNorm = String(slug).trim().replace(/\/+$/,'').toLowerCase();
  const pathNorm = normalizeServiceLink(`/services/${slugNorm}`)!;
  return all.find(s => normalizeServiceLink(s.link) === pathNorm || extractServiceSlug(s.link) === slugNorm);
};