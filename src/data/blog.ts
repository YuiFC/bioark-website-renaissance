export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
}

export const mockBlogPosts: BlogPost[] = [
  { 
    id: 1, 
    slug: 'future-of-gene-editing',
    title: 'The Future of Gene Editing in Oncology', 
    excerpt: 'Discover how CRISPR is revolutionizing cancer treatment...', 
    content: 'The advent of CRISPR-Cas9 has opened up unprecedented possibilities in the field of oncology. This powerful gene-editing tool allows scientists to make precise changes to the DNA of cancer cells, offering new avenues for treatment. From correcting cancer-causing mutations to engineering immune cells to better fight tumors, the potential is immense. In this post, we delve into the latest research, clinical trials, and the future landscape of personalized cancer therapy powered by gene editing.',
    author: 'Dr. Evelyn Reed',
    date: '2024-05-15'
  },
  { 
    id: 2, 
    slug: 'choosing-transfection-reagent',
    title: 'A Guide to Choosing the Right Transfection Reagent', 
    excerpt: 'Not all reagents are created equal. Here’s what to look for...', 
    content: 'Transfection is a cornerstone technique in molecular biology, but its success hinges on choosing the right reagent for your specific cell type and application. Factors such as efficiency, toxicity, and ease of use must be carefully considered. This guide provides a comprehensive overview of different types of transfection reagents, including lipid-based, polymer-based, and viral methods, helping you make an informed decision to maximize your experimental success.',
    author: 'Dr. Samuel Chen',
    date: '2024-05-01'
  },
  { 
    id: 3, 
    slug: 'advances-in-aav',
    title: 'Advances in AAV for Gene Therapy', 
    excerpt: 'Exploring the latest breakthroughs in adeno-associated virus vectors...', 
    content: 'Adeno-associated virus (AAV) vectors have become a leading platform for in vivo gene therapy due to their excellent safety profile and ability to transduce a wide range of cell types. Recent advancements have focused on engineering AAV capsids to improve tissue specificity, enhance transduction efficiency, and evade the host immune response. We explore these breakthroughs and their impact on treating genetic disorders, from rare diseases to more common conditions.',
    author: 'Dr. Maria Garcia',
    date: '2024-04-20'
  },
  { 
    id: 4, 
    slug: 'bioark-new-partnership',
    title: 'BioArk Tech Announces New Partnership', 
    excerpt: 'We are excited to collaborate with leading research institutions to accelerate discovery.', 
    content: 'BioArk Technologies is proud to announce a strategic partnership with the Innovate Research Institute. This collaboration will combine BioArk\'s proprietary gene-delivery platforms with the Institute\'s deep expertise in neurodegenerative diseases. Together, we aim to develop novel therapeutic strategies for conditions like Alzheimer\'s and Parkinson\'s disease, bringing hope to millions of patients worldwide. This partnership marks a significant milestone in our mission to advance genetic medicine.',
    author: 'BioArk News Team',
    date: '2024-04-10'
  },
];

