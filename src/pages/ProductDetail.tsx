
import React from 'react';
import { useParams } from 'react-router-dom';
import ProductDetailTemplate from '@/components/ProductDetailTemplate';
import { getProductBySlug } from '@/data/products';
import NotFound from './NotFound';

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const productData = slug ? getProductBySlug(slug) : undefined;

  if (!productData) {
    return <NotFound />;
  }

  // The category is not in the data, so we'll derive it or set a default
  const category = productData.catalogNumber.startsWith('FP') 
    ? 'Reagents and Markers' 
    : 'Genome Editing';

  // Prefer admin override for quoteOnly/contentText if present in productData
  const overrideQuoteOnly = (productData as any).quoteOnly as boolean | undefined;
  const overrideContentText = (productData as any).contentText as string | undefined;

  // Only Reagents & Markers are purchasable by default; others are quote-only
  const quoteOnly = overrideQuoteOnly ?? (category !== 'Reagents and Markers');

  // Overexpression Targeted Knock-In special content text
  const overexpressionContent = slug === 'overexpression-targeted-knock-in' ? `This technique enables the precise integration of target genes or regulatory cassettes into safe harbor sites—genomic regions where foreign DNA can be inserted without disrupting essential endogenous gene functions or causing adverse cellular effects. These sites are widely used in genome engineering for stable gene insertion, ensuring long-term and predictable transgene expression.

Commonly used safe harbor sites include human AAVS1 and CCR5, as well as the mouse ROSA26 locus. Our standard kit utilizes the AAVS1 site as the default insertion locus. For alternative loci or custom services, please contact us at support@bioarktech.com.

Technical Background
CRISPR-Cas9-mediated targeted knock-in at safe harbor sites involves:

Cas9: An endonuclease that creates a double-strand break (DSB) at the target site.
Guide RNA (gRNA): Directs Cas9 to the specific safe harbor locus, such as AAVS1 or the mouse ROSA26 locus.
Donor DNA template: A construct containing the desired transgene flanked by homology arms complementary to sequences adjacent to the AAVS1 site, facilitating targeted insertion via homology-directed repair (HDR).
 
Key Features of Our Products
Streamlined CRISPR and Donor Vectors
Designed for efficient target gene integration, outperforming commercially available alternatives.
Targeted vs. Random Integration
Many conventional approaches rely on non-targeting lentiviruses, leading to random gene integration, which can pose safety risks and unpredictable outcomes, particularly in gene therapy and clinical research.
Our vector and virus kits enable precise, targeted integration at safe harbor sites, significantly reducing these risks.
User-Friendly Plasmid Kits for Broad Accessibility
Unlike many market solutions that require electroporation—necessitating specialized equipment and techniques—our plasmid-based kits are optimized for ease of use, making them ideal for adherent cancer cell lines.

10
entries per page
Search:
Edit
Major Vector			Donor Vector			Scramble Control Vector		
Class	Product Name	SKU	Information	Donor Name	SKU	Information	Scramble Name	SKU	Information
Non-Viral CDS-P011k	CRISPR KN AIO Kit-Gene AAVS1, Vector type	COT-FXD00A-AAVS1gk	The CRISPR tool specifically designed to target and cut human AAVS1 safe harbor site.	AAVS1 Dnr Std Kit	CDS-FX00PA-XXXXXXk	Insert Customer Gene into human AAVS1 site, please specify your genes by clicking the button	GFP Donor Control AAVS1 Dnr Std Ctrl Kit, vector type	CDS-FX0GPA-000000k	Insert GFP into human AAVS1 site as control
Non-Viral CDS-P011k	CRISPR KN AIO Kit-Gene ROSA26, Vector type	COT-FXD00A-ROSA26gk	The CRISPR tool specifically designed to target and cut mouse ROSA26 safe harbor site.	Dnr Std Kit-ROSA26 Site	TBD	Insert Customer Gene into mouse ROSA26 site, please specify your custom gene by clicking the button	GFP Donor Control Dnr Std Kit-ROSA26 Site, vector type	TBD	Insert GFP into mouse ROSA26 site as control
Showing 1 to 3 of 3 entries
Our design program assists customers in adjusting vector components and developing specific functions tailored to their unique requirements.` : undefined;

  return (
    <ProductDetailTemplate
      {...productData}
      title={productData.name}
      category={category}
      mainImage={productData.imageUrl || ''}
      quoteOnly={quoteOnly}
      contentText={overrideContentText ?? overexpressionContent}
      showBottomAddToCart={slug === 'overexpression-targeted-knock-in'}
    />
  );
};

export default ProductDetail;
