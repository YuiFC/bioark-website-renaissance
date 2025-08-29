export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string; // ISO string
  category?: string;
  coverImage?: string; // path under public/ or imported asset
  readTime?: number; // minutes
  views?: number;
  tags?: string[];
}

export const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    slug: 'stitchr-retrotransposon-precision-integration',
    title: 'STITCHR: A New Gene Editing Platform for Scarless Large-Fragment Integration',
    excerpt: 'Harvard-led team unveils STITCHR, enabling scarless insertion up to 12.7 kb with high precision and cell-cycle independence.',
  content: `A Harvard-led team (Jonathan S. Gootenberg and Omar O. Abudayyeh) reported a programmable retrotransposon platform named STITCHR in Nature (“Reprogramming site-specific retrotransposon activity to new DNA sites”). The system couples CRISPR targeting with retrotransposon template-primed reverse transcription (TPRT) to enable scarless integration of DNA fragments ranging from single bases to >10 kb.

> Note: STITCHR is distinct from a similarly named “StitchR” approach that uses ribozyme-mediated mRNA trans-ligation to deliver large genes. The two technologies address different delivery challenges.

## What is STITCHR?
STITCHR reprograms an R2-like retrotransposon to insert payload DNA at CRISPR-specified genomic sites. A Cas9 H840A nickase introduces a single-strand nick to expose a 3' end that primes reverse transcription of the donor template, leading to homology-guided, scarless integration.

### How it works (high level)
- Cas9 H840A nickase targets the site, generating a nick and a 3' OH for priming.
- The retrotransposon reverse transcriptase extends from the nick into the donor template.
- Homology sequences guide precise ligation and completion, yielding seamless integration.

## Why it matters
- Scarless, seamless insertion up to ~12.7 kb: expands edits beyond the ~<500 bp typical for base/prime editing.
- High targeting precision with low off-target activity: nickase + TPRT pairing improves specificity versus classical double-strand breaks.
- Cell-cycle independence: maintains activity even when division is blocked (e.g., doxorubicin), enabling edits in non-dividing cells like neurons.

## Key capabilities
- Single-nucleotide edits, short tags, and full-length gene replacement within one platform.
- Potential compatibility with diverse cell types and tissues.
- Modular donor design with homology handles for flexible targeting.

## Technical challenges and open questions
### 1) Deliverability and construct size
The current fusion payload is large (Cas9 ~4.1 kb + retrotransposon components ~3.6 kb), which complicates in vivo delivery. RNA-formulated versions and LNP delivery are being explored, though RNA typically shows lower efficiency than plasmid/viral methods. A complementary direction is mRNA trans-ligation (the separate StitchR line of work) to handle very large cargos.

### 2) Mechanism: second-strand synthesis and completion
Details of in vivo second-strand DNA synthesis during homology-guided TPRT remain to be clarified. Better mechanistic insight should improve efficiency and fidelity.

### 3) Efficiency evolution
Homology-directed TPRT alone can be <1% but rises to ~3–11% when paired with Cas9 H840A in STITCHR. There is room to engineer both the TPRT module and CRISPR partner for higher rates.

## Early applications to watch
- Precise knock-ins for reporter tags and epitope fusions.
- Scarless correction or replacement of disease alleles.
- Installation of complex gene circuits without residual sequence scars.

## Outlook
STITCHR adds a much-needed option for large, precise, and potentially cell-cycle-agnostic integrations. Continued work on delivery (smaller constructs, RNA/LNP), mechanistic tuning, and donor design should determine how quickly the platform moves toward preclinical use.`,
    author: 'BioArk Editorial Team',
    date: '2025-04-22',
  category: 'AI Trends',
  coverImage: '/images/blog/Blog-1-20250422.png',
    readTime: 9,
    views: 0,
    tags: ['CRISPR', 'Retrotransposon', 'Large Insertion']
  },
  {
    id: 2,
    slug: 'car-t-autologous-universal-in-vivo-and-crispr',
    title: 'CAR-T Therapies: Autologous, Universal, and In Vivo Approaches',
    excerpt: 'From autologous to universal and in vivo CAR-T, CRISPR innovations are reshaping integration, safety, and scalability.',
  content: `CAR-T therapies have transformed oncology, particularly for hematologic malignancies. Today’s development landscape spans three approaches—autologous, universal (allogeneic), and in vivo—each with distinct trade-offs in speed, cost, safety, and scalability.

## Three approaches at a glance
### Autologous (patient-derived)
- Pros: Proven efficacy; lower graft-versus-host risk; established regulatory precedents.
- Cons: Expensive and slow (bespoke manufacturing); variable starting material quality; challenging for rapidly progressing disease.

### Universal / Allogeneic (donor-derived, off‑the‑shelf)
- Pros: Batch manufacturing, lower cost of goods, faster turnaround; scalable logistics.
- Cons: Requires edits to reduce graft-versus-host and host-vs-graft rejection (e.g., TRAC, B2M, HLA); persistent immunogenicity risks.

### In vivo (edited inside the patient)
- Pros: Eliminates ex vivo manufacturing; potential for broad access and rapid deployment.
- Cons: Delivery remains the central challenge (viral vectors, VLPs, LNPs); dosing control and safety switching are active areas of research.

## How CRISPR is reshaping CAR-T
- Targeted integration: Site-specific insertion (e.g., TRAC, CCR5, PDCD1) improves expression uniformity and reduces insertional mutagenesis risk.
- Multiplex edits: Knockout of endogenous TCR and HLA to enable universal products; edits to resist exhaustion and immunosuppression.
- Built-in safety features: Inducible kill switches, suicide genes, and logic-gated CARs to mitigate severe adverse events.
- Epigenetic tuning: dCas-based regulators can modulate checkpoint genes and cytokines to improve persistence.

## Manufacturing, scale, and quality
- Autologous: vein-to-vein time is the bottleneck; orchestration and analytics (QC release) drive cost.
- Allogeneic: scale helps COGS, but genome engineering and release testing must assure product consistency.
- In vivo: analytics shift to biodistribution, persistence, and on/off-target profiling of the delivery system.

## Safety and regulatory considerations
- Genomic safety: minimize off-target edits; leverage validated safe-harbor loci and orthogonal nucleases.
- Immunogenicity: reduce alloreactivity and anti-product responses; consider humanized components.
- Pharmacology: dose control and reversibility (e.g., small-molecule gated CARs) for severe toxicity management.

## Outlook
CRISPR-enabled CAR-T is moving beyond “insert a CAR” to programmable cell therapies with multiplex edits and tunable function. In vivo editing could unlock true global scale if delivery hurdles are solved. Collaboration across delivery, editing, and manufacturing will determine how quickly the field expands from blood cancers into solid tumors.`,
    author: 'BioArk Editorial Team',
    date: '2025-05-04',
  category: 'Business Use Cases',
  coverImage: '/images/blog/Blog-2-20250504.jpg',
    readTime: 7,
    views: 0,
    tags: ['CAR-T', 'CRISPR', 'Oncology']
  },
  {
    id: 3,
    slug: 'the-secret-of-pam-and-next-gen-crispr',
    title: 'The Secret of PAM: Is It Essential for CRISPR Targeting?',
    excerpt: 'Recent studies reveal why PAM powers efficient Cas9 targeting and how next-gen systems may bypass PAM with new mechanics.',
  content: `The Protospacer Adjacent Motif (PAM) is central to how many CRISPR systems recognize double‑stranded DNA (dsDNA). A recent Molecular Cell study (“Rapid Two-Step Target Capture Ensures Efficient CRISPR-Cas9-Guided Genome Editing,” Doudna, Bryant et al.) helps explain why PAM improves both speed and fidelity—and why PAM-relaxed variants like SpRY often lose efficiency while increasing off‑target risk.

## Why PAM helps Cas9
- PAM provides a quick “license to bind,” allowing Cas9 to rapidly sample DNA and reject non-target sites.
- Following PAM engagement, the duplex locally unwinds and seeds R‑loop formation, enabling stepwise RNA:DNA hybridization.

### A two‑step capture model (per Molecular Cell)
1. Priming: PAM-dependent docking lowers the energetic barrier for local unwinding.
2. Unwinding and propagation: The R‑loop initiates in the seed and extends to complete target capture.

This helps explain why SpRY, which binds many PAM-like contexts more strongly, can paradoxically hinder the unwinding/propagation step—slower editing and more off-targets despite broader nominal compatibility.

## Systems that do not require PAM
- ss targets: Cas14 (ssDNA) and Cas13 (RNA) do not need a strict PAM/PFS because the energetic barrier for unwinding is low or absent.
- Novel dsDNA systems without PAM: Tigr‑Tas (Zhang lab) and IS110 (Hsu lab) appear to use split/dual‑strand engagement rather than a single PAM-licensed site. Early editing efficiencies are low (e.g., <5%), suggesting a missing or inefficient priming step that future engineering may improve.

## Implications for next‑gen editors
- PAM is not merely a constraint; it’s part of a finely tuned balance between specificity and efficiency.
- PAM-relaxed nucleases need additional engineering to restore efficient unwinding and R‑loop propagation.
- New “no‑PAM” dsDNA systems may open fresh design space (cis vs. trans recognition modes), but require optimization to match practical editing performance.

Bottom line: Understanding the physics of target capture—PAM licensing, unwinding, and R‑loop kinetics—will guide safer, faster, and more versatile genome editors.`,
    author: 'BioArk Editorial Team',
    date: '2025-05-07',
  category: 'AI Trends',
  coverImage: '/images/blog/Blog-3-20250507.jpg',
    readTime: 11,
    views: 0,
    tags: ['CRISPR', 'PAM', 'Cas9']
  },
  {
    id: 4,
    slug: 'vlp-delivery-envlpe-plus-prime-editing',
    title: 'VLPs vs AAVs: ENVLPE+ Advances for CRISPR RNP and Prime Editing Delivery',
    excerpt: 'ENVLPE+ boosts VLP packaging, stability, and delivery for prime editing, pointing to safer, modular gene therapy vectors.',
  content: `Compared with adeno‑associated viruses (AAVs), virus‑like particles (VLPs) can deliver CRISPR ribonucleoproteins (RNPs) transiently with lower immunogenicity, flexible tropism via pseudotyping, and strong specificity. Remaining hurdles—RNP stability, packaging efficiency, and potency—are being addressed by new engineering strategies.

One such advance is ENVLPE+ (Cell: “Engineered nucleocytosolic vehicles for loading of programmable editors,” Truong, Geilenkeuser et al.), which improves packaging and delivery of prime editing effectors.

## What is ENVLPE+?
ENVLPE+ retools the Gag‑Pol framework and RNA scaffolds to increase cargo loading, stabilize pegRNA, and enhance budding and particle yield.

### Key components
- Optimized Gag–Pol fusion with enhanced nucleo‑cytoplasmic shuttling tags and a PCP–aptamer system to export RNPs to the cytoplasm for packaging.
- PP7–C4‑Q1 scaffold that stabilizes pegRNA and maintains complex integrity during assembly.
- Engineered coiled‑coil domains for Gag–PCP oligomerization, boosting budding and packaging efficiency.
- MiniENVLPE: a highly truncated design (<13% of HIV‑1 Gag) that preserves most editing/packaging function—promising for low‑immunogenicity vectors.

## Why it matters for prime editing
- Higher RNP/pegRNA stability improves edit rates while keeping exposure transient.
- Modular envelopes allow tissue targeting by pseudotyping.
- Truncated backbones point toward safer clinical translation.

## Research opportunities
1. All‑in‑one CRISPR VLPs that co‑deliver RNPs and donor DNA.
2. Systematically combine gRNA stabilization and Cas9 loading motifs for maximal potency.
3. MiniENVLPE‑based variants optimized for low immunogenicity.
4. Expanded pseudotype library to reach difficult tissues.

## Outlook
VLPs are emerging as a practical, safer alternative to integrating viral vectors for genome editing. With designs like ENVLPE+, the field is moving toward programmable, modular vehicles that can deliver prime editors with higher efficiency and better control.`,
    author: 'BioArk Editorial Team',
    date: '2025-06-17',
  category: 'Business Use Cases',
  coverImage: '/images/blog/Blog-4-20250617.png',
    readTime: 8,
    views: 0,
    tags: ['VLP', 'AAV', 'Prime Editing']
  },
];

