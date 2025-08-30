import { Beaker, Dna, Wrench } from 'lucide-react';

export interface ShowcaseItem {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  icon?: React.ElementType;
  link: string;
}

export const featuredProducts: ShowcaseItem[] = [
  {
    id: 'fp-badm3362',
    name: 'BADM3362 – GN8K DNA Marker (100-8000bp)',
    description: 'Ideal for routine DNA analysis and sizing from 100 bp to 8 kb.',
    imageUrl: '/images/products/BADM3362_GN8K_DNA_Marker-1-300x300.jpg',
    link: '/products/gn8k-dna-marker'
  },
  {
    id: 'fp-badm3363',
    name: 'BADM3363 – GN10K DNA Marker (300-10000bp)',
    description: 'Ready-to-use DNA ladder for precise sizing of a wide range of DNA fragments.',
    imageUrl: '/images/products/BADM3363_GN10K_DNA_Marker-1-300x300.jpg',
    link: '/products/gn10k-dna-marker'
  },
  {
    id: 'fp-badm3364',
    name: 'BADM3364 – GN15K DNA Marker (500-15000bp)',
    description: 'For sizing large DNA fragments with high accuracy up to 15 kb.',
    imageUrl: '/images/products/BADM3364_GN15K_DNA_Marker-1-300x300.jpg',
    link: '/products/gn15k-dna-marker'
  },
  {
    id: 'fp-bal100468',
    name: 'BAL100468 – BioArkLipo® In Vitro Transfection Kit (Ver. II)',
    description: 'High-efficiency, low-toxicity lipid-based transfection for a wide range of cell lines.',
    imageUrl: '/images/products/BioArkLipo-1-300x300.png',
    link: '/products/bioarklipo-in-vitro-transfection-kit'
  },
  {
    id: 'fp-bal100668',
    name: 'BAL100668 – BAJet® In Vitro DNA Transfection Reagent',
    description: 'A powerful reagent for efficient delivery of nucleic acids for gene editing.',
    imageUrl: '/images/products/BAjet-1-300x300.png',
    link: '/products/bajet-transfection-reagent'
  },
  {
    id: 'fp-bal100688',
    name: 'BAL100688 – BAPoly® In Vitro DNA Transfection Reagent',
    description: 'Polymer-based reagent for efficient transfection of various cell types.',
    imageUrl: '/images/products/BAPoly-1-300x300.png',
    link: '/products/bapoly-transfection-reagent'
  },
  {
    id: 'fp-bapm2083',
    name: 'BAPM2083 – Prestained Protein Marker IV (8-200 kDa)',
    description: 'Broad-range, three-color protein standard for monitoring protein separation.',
    imageUrl: '/images/products/BAPM2086_Western_Protein_Marker_I-1-300x300.jpg',
    link: '/products/prestained-protein-marker-iv'
  },
  {
    id: 'fp-bapm2086',
    name: 'BAPM2086 – Western Protein Marker I (Exposure)',
    description: 'High-quality protein standard for accurate molecular weight estimation.',
    imageUrl: '/images/products/BAPM2086_Western_Protein_Marker_I-1-300x300.jpg',
    link: '/products/western-protein-marker-i'
  },
  {
    id: 'fp-bsy3320',
    name: 'BSY3320 – 2 × SYBR Green qPCR Master Mix',
    description: 'A reliable and cost-effective solution for standard real-time PCR.',
    imageUrl: '/images/products/1-BSY3320_2__SYBR_Green_qPCR_Master_Mix-300x300.jpg',
    link: '/products/sybr-green-qpcr-mix'
  },
  {
    id: 'fp-bsy3323',
    name: 'BSY3323 – 2 × Fast SYBR Green qPCR Master Mix',
    description: 'Optimized for rapid and accurate quantification of DNA targets in real-time PCR.',
    imageUrl: '/images/products/1-BSY3323_2__Fast_SYBR_Green_qPCR_Master_Mix-300x300.jpg',
    link: '/products/fast-sybr-green-qpcr-mix'
  },
];

export const geneEditingProducts: ShowcaseItem[] = [
  { id: 'gep-01', name: 'Gene Knock-In & Tagging', description: 'Precision services for endogenous gene tagging and reporter knock-in.', imageUrl: '/images/products/Product-1-2-Gene-Knock-In-Tagging-300x227.jpg', link: '/products/gene-knock-in' },
  { id: 'gep-02', name: 'Gene Knock-Out Services', description: 'Generate complete loss-of-function models using CRISPR-Cas9 technology.', imageUrl: '/images/products/Product-1-3-Gene-Knock-out-300x200.jpg', link: '/products/gene-knock-out' },
  { id: 'gep-03', name: 'Large Fragment Gene Deletion', description: 'Expertly remove large genomic regions to study gene function.', imageUrl: '/images/products/Product-1-4-Gene-Deletion-300x180.jpeg', link: '/products/gene-deletion' },
  { id: 'gep-04', name: 'CRISPRi & RNAi Knock-Down', description: 'Modulate gene expression with our reliable RNA interference services.', imageUrl: '/images/products/Product-1-5-CRISPR-RNA-Knock-Down-300x128.png', link: '/products/crispr-knock-down' },
    { id: 'gep-05', name: 'Targeted Knock-In', description: 'Precise integration to drive robust gene overexpression at safe-harbor or locus-specific sites.', imageUrl: '/images/products/Product-1-1-Overexpression-Targeted-Knock-In.png', link: '/products/overexpression-targeted-knock-in' },
];

export const customerSolutions: ShowcaseItem[] = [
  { id: 'cs-01', name: 'Custom Cloning Services', description: 'End-to-end plasmid design, cloning, synthesis, and delivery.', icon: Dna, link: '/services/custom-cloning' },
  { id: 'cs-03', name: 'Lentivirus Packaging Services', description: 'High-titer lentivirus packaging with full QC and functional options.', icon: Wrench, link: '/services/lentivirus-packaging' },
  { id: 'cs-04', name: 'Stable Cell Line Services', description: 'From vector design to monoclonal selection and validation.', icon: Dna, link: '/services/cell-line-generation' },
  { id: 'cs-05', name: 'Lab Supplies', description: 'Reagents and kits for cloning, qPCR, markers, and transfection.', icon: Beaker, link: '/services/lab-supplies' },
];