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
    id: 'fp-01',
    name: 'BioArkLipo® In Vitro Transfection Kit',
    description: 'High-efficiency, low-toxicity lipid-based transfection for a wide range of cell lines.',
    imageUrl: '/images/products/BioArkLipo-1-300x300.png', // This file exists
    link: '/products/bioarklipo-in-vitro-transfection-kit'
  },
  {
    id: 'fp-02',
    name: 'GN10K DNA Marker (300-10000bp)',
    description: 'Ready-to-use DNA ladder for precise sizing of a wide range of DNA fragments.',
    imageUrl: '/images/products/BADM3363_GN10K_DNA_Marker-1-300x300.jpg', // This file exists
    link: '/products/gn10k-dna-marker'
  },
  {
    id: 'fp-03',
    name: '2 × Fast SYBR Green qPCR Master Mix',
    description: 'Optimized for rapid and accurate quantification of DNA targets in real-time PCR.',
    imageUrl: '/images/products/1-BSY3323_2__Fast_SYBR_Green_qPCR_Master_Mix-300x300.jpg', // This file exists
    link: '/products/fast-sybr-green-qpcr-mix'
  },
  {
    id: 'fp-04',
    name: 'Prestained Protein Marker IV (8-200 kDa)',
    description: 'Broad-range, three-color protein standard for monitoring protein separation.',
    imageUrl: '/images/products/BAPM2086_Western_Protein_Marker_I-1-300x300.jpg', // This file exists
    link: '/products/prestained-protein-marker-iv'
  },
  {
    id: 'fp-05',
    name: 'GN8K DNA Marker (100-8000bp)',
    description: 'Ideal for routine DNA analysis and sizing from 100bp to 8kb.',
    imageUrl: '/images/products/BADM3362_GN8K_DNA_Marker-1-300x300.jpg', // This file exists
    link: '/products/gn8k-dna-marker'
  },
  {
    id: 'fp-06',
    name: '2 × SYBR Green qPCR Master Mix',
    description: 'A reliable and cost-effective solution for standard real-time PCR.',
    imageUrl: '/images/products/1-BSY3320_2__SYBR_Green_qPCR_Master_Mix-300x300.jpg', // This file exists
    link: '/products/sybr-green-qpcr-mix'
  },
  {
    id: 'fp-07',
    name: 'BAPoly® In Vitro DNA Transfection Reagent',
    description: 'Polymer-based reagent for efficient transfection of various cell types.',
    imageUrl: '/images/products/BAPoly-1-300x300.png', // This file exists
    link: '/products/bapoly-transfection-reagent'
  },
  {
    id: 'fp-08',
    name: 'GN15K DNA Marker (500-15000bp)',
    description: 'For sizing large DNA fragments with high accuracy up to 15kb.',
    imageUrl: '/images/products/BADM3364_GN15K_DNA_Marker-1-300x300.jpg', // This file exists
    link: '/products/gn15k-dna-marker'
  },
  {
    id: 'fp-09',
    name: 'BAJet® In Vitro DNA Transfection Reagent',
    description: 'A powerful reagent for efficient delivery of nucleic acids for gene editing.',
    imageUrl: '/images/products/BAjet-1-300x300.png', // This file exists
    link: '/products/bajet-transfection-reagent'
  },
  {
    id: 'fp-10',
    name: 'Western Protein Marker I',
    description: 'High-quality protein standard for accurate molecular weight estimation.',
    imageUrl: '/images/products/BAPM2086_Western_Protein_Marker_I-1-300x300.jpg', // Re-using an image
    link: '/products/western-protein-marker-i'
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
  { id: 'cs-02', name: 'Genome Editing Services', description: 'Targeted overexpression, CRISPR knockout, and RNA knockdown.', icon: Beaker, link: '/services/genome-editing' },
  { id: 'cs-03', name: 'Lentivirus Packaging Services', description: 'High-titer lentivirus packaging with full QC and functional options.', icon: Wrench, link: '/services/lentivirus-packaging' },
  { id: 'cs-04', name: 'Stable Cell Line Services', description: 'From vector design to monoclonal selection and validation.', icon: Dna, link: '/services/cell-line-generation' },
  { id: 'cs-05', name: 'Lab Supplies', description: 'Reagents and kits for cloning, qPCR, markers, and transfection.', icon: Beaker, link: '/services/lab-supplies' },
];