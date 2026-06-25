export type Category = 'single-peptides' | 'peptide-blends' | 'wolverine-stack' | 'reconstitution'

export interface Product {
  id: string
  slug: string
  name: string
  shortName: string
  cas: string
  category: Category
  categoryLabel: string
  purity: string
  sizes: ProductSize[]
  description: string
  mechanism: string
  storage: string
  molecularWeight: string
  formula: string
  sequence?: string
  batchNumber: string
  testDate: string
  tags: string[]
  featured?: boolean
  inStock: boolean
  coaUrl: string
  color: string
  image: string
}

export interface ProductSize {
  mg: number
  price: number
  sku: string
}

export const PRODUCTS: Product[] = [
  {
    id: 'bpc157',
    slug: 'bpc-157-5mg',
    name: 'BPC-157 — 5mg',
    shortName: 'BPC-157',
    cas: '137525-51-0',
    category: 'single-peptides',
    categoryLabel: 'Single Peptides',
    purity: '99.4%',
    sizes: [
      { mg: 5, price: 49.99, sku: 'NXG-BPC-5MG' },
      { mg: 10, price: 89.99, sku: 'NXG-BPC-10MG' },
    ],
    description: 'BPC-157 (Body Protective Compound-157) is a pentadecapeptide consisting of 15 amino acids derived from a protective protein found in gastric juice. As a research compound, BPC-157 has been studied extensively in cell culture and animal models for its interactions with growth hormone receptor signaling and its role in angiogenesis modulation.',
    mechanism: 'Research indicates BPC-157 may interact with the nitric oxide system and upregulate growth hormone receptors in tendon fibroblasts. In vitro studies demonstrate potential modulation of VEGF expression and FAK-paxillin pathway activation, suggesting involvement in cellular migration and proliferation models.',
    storage: 'Store lyophilized peptide at −20°C. Once reconstituted, maintain at 2–8°C and use within 28 days. Avoid freeze-thaw cycles. Keep away from light.',
    molecularWeight: '1419.55 g/mol',
    formula: 'C₆₂H₉₈N₁₆O₂₂',
    sequence: 'Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val',
    batchNumber: 'NXG-2026-Q2-001',
    testDate: '2026-05-14',
    tags: ['Peptide', 'Cytoprotective', 'Research Grade'],
    featured: true,
    inStock: true,
    coaUrl: '/coa/NXG-2026-Q2-001.pdf',
    color: '#1568D3',
    image: '/images/products/bpc-157.png',
  },
  {
    id: 'tb500',
    slug: 'tb-500-5mg',
    name: 'TB-500 — 5mg',
    shortName: 'TB-500',
    cas: '77591-33-4',
    category: 'single-peptides',
    categoryLabel: 'Single Peptides',
    purity: '99.1%',
    sizes: [
      { mg: 5, price: 59.99, sku: 'NXG-TB5-5MG' },
      { mg: 10, price: 109.99, sku: 'NXG-TB5-10MG' },
    ],
    description: 'TB-500 is a synthetic analogue of Thymosin Beta-4 (Tβ4), a naturally occurring 43 amino acid peptide ubiquitously expressed in mammalian tissues. TB-500 corresponds to the active domain fragment Ac-SDKPDMAEIEKFDKSKLKKT-NH2, which exhibits actin-binding properties in research settings.',
    mechanism: 'In cellular research models, TB-500 demonstrates binding affinity to G-actin monomers via its LKKTET motif, potentially influencing actin polymerization dynamics. Studies suggest involvement in cell migration assays and endothelial tube formation models relevant to angiogenesis research.',
    storage: 'Store lyophilized peptide at −20°C. Reconstitute with sterile bacteriostatic water. Maintain at 4°C post-reconstitution, use within 30 days.',
    molecularWeight: '2113.4 g/mol',
    formula: 'C₉₅H₁₅₂N₂₄O₃₅S',
    batchNumber: 'NXG-2026-Q2-002',
    testDate: '2026-05-14',
    tags: ['Peptide', 'Actin-binding', 'Research Grade'],
    featured: true,
    inStock: true,
    coaUrl: '/coa/NXG-2026-Q2-002.pdf',
    color: '#0F4FA8',
    image: '/images/products/tb-500.png',
  },
  {
    id: 'cjc1295',
    slug: 'cjc-1295-2mg',
    name: 'CJC-1295 — 2mg',
    shortName: 'CJC-1295',
    cas: '863288-34-0',
    category: 'single-peptides',
    categoryLabel: 'Single Peptides',
    purity: '98.9%',
    sizes: [
      { mg: 2, price: 44.99, sku: 'NXG-CJC-2MG' },
      { mg: 5, price: 99.99, sku: 'NXG-CJC-5MG' },
    ],
    description: 'CJC-1295 is a synthetic analogue of growth hormone-releasing hormone (GHRH) engineered with a Drug Affinity Complex (DAC) via a lysine linker. The DAC technology enables covalent binding to circulating albumin, extending plasma half-life in preclinical pharmacokinetic models.',
    mechanism: 'CJC-1295 binds to GHRH receptors on pituitary somatotrophs in research preparations, stimulating cAMP-mediated signaling cascades. Preclinical studies examine its pharmacokinetic profile and downstream GH/IGF-1 axis modulation in various tissue research models.',
    storage: 'Lyophilized: store at −80°C for long-term stability or −20°C for up to 12 months. Reconstituted: 4°C, use within 14 days.',
    molecularWeight: '3647.3 g/mol',
    formula: 'C₁₆₅H₂₆₉N₄₇O₄₆',
    batchNumber: 'NXG-2026-Q2-003',
    testDate: '2026-05-15',
    tags: ['GHRH Analogue', 'DAC', 'Research Grade'],
    featured: true,
    inStock: true,
    coaUrl: '/coa/NXG-2026-Q2-003.pdf',
    color: '#1568D3',
    image: '/images/products/cjc-1295.png',
  },
  {
    id: 'ipamorelin',
    slug: 'ipamorelin-5mg',
    name: 'Ipamorelin — 5mg',
    shortName: 'Ipamorelin',
    cas: '170851-70-4',
    category: 'single-peptides',
    categoryLabel: 'Single Peptides',
    purity: '99.2%',
    sizes: [
      { mg: 5, price: 39.99, sku: 'NXG-IPA-5MG' },
      { mg: 10, price: 69.99, sku: 'NXG-IPA-10MG' },
    ],
    description: 'Ipamorelin is a selective growth hormone secretagogue and ghrelin receptor (GHS-R1a) agonist consisting of five amino acids. Its selectivity profile in research settings distinguishes it from earlier generation GHS compounds through its minimal effect on cortisol and prolactin release in in vitro assays.',
    mechanism: 'Research demonstrates Ipamorelin\'s selective GHS-R1a binding with minimal off-target receptor activity. Cell-based assays show IP3-mediated calcium mobilization and ERK1/2 phosphorylation downstream of receptor activation, making it a useful tool compound in endocrine signaling research.',
    storage: 'Lyophilized: −20°C for up to 24 months. Reconstituted in bacteriostatic water: 4°C, stable for 21 days.',
    molecularWeight: '711.86 g/mol',
    formula: 'C₃₈H₄₉N₉O₅',
    batchNumber: 'NXG-2026-Q2-004',
    testDate: '2026-05-16',
    tags: ['GHS', 'Selective', 'Research Grade'],
    featured: false,
    inStock: true,
    coaUrl: '/coa/NXG-2026-Q2-004.pdf',
    color: '#5B6B80',
    image: '/images/products/ipamorelin.png',
  },
  {
    id: 'semaglutide',
    slug: 'semaglutide-5mg',
    name: 'Semaglutide — 5mg',
    shortName: 'Semaglutide',
    cas: '910463-68-2',
    category: 'single-peptides',
    categoryLabel: 'Single Peptides',
    purity: '99.0%',
    sizes: [
      { mg: 5, price: 179.99, sku: 'NXG-SEM-5MG' },
      { mg: 10, price: 329.99, sku: 'NXG-SEM-10MG' },
    ],
    description: 'Semaglutide is a long-acting GLP-1 receptor agonist peptide with a C18 fatty diacid modification enabling albumin binding. This structural feature prolongs pharmacokinetic half-life in preclinical pharmacology research. The compound is provided for in vitro receptor binding studies and research applications only.',
    mechanism: 'In research preparations, Semaglutide demonstrates high-affinity binding to GLP-1 receptors (GLP-1R) with activation of adenylyl cyclase and elevation of intracellular cAMP. Research applications include GLP-1R signaling studies, beta-cell biology models, and structure-activity relationship investigations.',
    storage: 'Lyophilized peptide: −80°C for optimal stability. Do not expose to repeated temperature fluctuations. Reconstituted solution: 4°C, use within 7 days.',
    molecularWeight: '4113.6 g/mol',
    formula: 'C₁₈₇H₂₉₁N₄₅O₅₉',
    batchNumber: 'NXG-2026-Q2-005',
    testDate: '2026-05-17',
    tags: ['GLP-1 Agonist', 'Long-Acting', 'Research Grade'],
    featured: true,
    inStock: true,
    coaUrl: '/coa/NXG-2026-Q2-005.pdf',
    color: '#0A3880',
    image: '/images/products/semaglutide.png',
  },
  {
    id: 'ghkcu',
    slug: 'ghk-cu-50mg',
    name: 'GHK-Cu — 50mg',
    shortName: 'GHK-Cu',
    cas: '89030-95-5',
    category: 'single-peptides',
    categoryLabel: 'Single Peptides',
    purity: '99.3%',
    sizes: [
      { mg: 50, price: 34.99, sku: 'NXG-GHK-50MG' },
      { mg: 200, price: 109.99, sku: 'NXG-GHK-200MG' },
    ],
    description: 'GHK-Cu (Copper Peptide) is a naturally occurring tripeptide-copper complex (Gly-His-Lys·Cu²⁺) present in human plasma. In research contexts, GHK-Cu has been studied for its interactions with matrix metalloproteinases, collagen synthesis pathways, and various gene expression modulation studies.',
    mechanism: 'Research demonstrates GHK-Cu modulates the expression of over 4,000 human genes in cellular models, primarily through interactions with collagen synthesis regulators and antioxidant defense pathways. Fibroblast culture studies examine its effects on extracellular matrix protein expression.',
    storage: 'Store lyophilized powder at 2–8°C. Protect from light and moisture. Reconstituted solution: refrigerate at 4°C, stable for 14 days.',
    molecularWeight: '340.38 g/mol',
    formula: 'C₁₄H₂₃CuN₆O₄',
    batchNumber: 'NXG-2026-Q2-006',
    testDate: '2026-05-18',
    tags: ['Copper Complex', 'Tripeptide', 'Research Grade'],
    featured: false,
    inStock: true,
    coaUrl: '/coa/NXG-2026-Q2-006.pdf',
    color: '#1568D3',
    image: '/images/products/ghk-cu.png',
  },
  {
    id: 'melanotan2',
    slug: 'melanotan-ii-10mg',
    name: 'Melanotan II — 10mg',
    shortName: 'Melanotan II',
    cas: '121062-08-6',
    category: 'single-peptides',
    categoryLabel: 'Single Peptides',
    purity: '98.8%',
    sizes: [
      { mg: 10, price: 29.99, sku: 'NXG-MT2-10MG' },
    ],
    description: 'Melanotan II is a cyclic lactam analogue of α-melanocyte-stimulating hormone (α-MSH) with enhanced receptor binding characteristics. As a research compound, it serves as a pharmacological tool for investigating melanocortin receptor subtypes (MC1R–MC5R) and their downstream signaling cascades.',
    mechanism: 'Melanotan II functions as a non-selective melanocortin receptor agonist in research binding assays. Studies utilizing this compound focus on MC1R-mediated cAMP signaling in melanocyte research models and MC4R involvement in hypothalamic signaling pathway investigations.',
    storage: 'Lyophilized: −20°C, stable for 24 months. Light-sensitive — store in amber vials. Reconstituted: 4°C, use within 14 days, protect from light.',
    molecularWeight: '1024.18 g/mol',
    formula: 'C₅₀H₆₉N₁₅O₉',
    batchNumber: 'NXG-2026-Q2-007',
    testDate: '2026-05-19',
    tags: ['MC Receptor', 'Cyclic Peptide', 'Research Grade'],
    featured: false,
    inStock: true,
    coaUrl: '/coa/NXG-2026-Q2-007.pdf',
    color: '#5B6B80',
    image: '/images/products/melanotan-ii.png',
  },
  {
    id: 'thymosin-alpha1',
    slug: 'thymosin-alpha-1-5mg',
    name: 'Thymosin Alpha-1 — 5mg',
    shortName: 'Thymosin Alpha-1',
    cas: '62304-98-7',
    category: 'single-peptides',
    categoryLabel: 'Single Peptides',
    purity: '99.1%',
    sizes: [
      { mg: 5, price: 69.99, sku: 'NXG-TA1-5MG' },
    ],
    description: 'Thymosin Alpha-1 (Tα1) is a 28 amino acid N-terminally acetylated peptide derived from prothymosin alpha. Originally isolated from thymic tissue, it has been studied extensively in immunology research for its interactions with toll-like receptors and dendritic cell maturation pathways.',
    mechanism: 'Research applications of Thymosin Alpha-1 include TLR2 and TLR9 signaling studies, where the compound demonstrates modulation of downstream NF-κB activation. Dendritic cell culture models examine IL-12 production and T-helper cell differentiation pathways in controlled laboratory settings.',
    storage: 'Lyophilized: −20°C, stable up to 36 months. Reconstituted: 4°C, use within 21 days. Single-use aliquoting recommended.',
    molecularWeight: '3108.5 g/mol',
    formula: 'C₁₃₂H₂₁₀N₃₄O₄₃',
    batchNumber: 'NXG-2026-Q2-008',
    testDate: '2026-05-20',
    tags: ['Thymic Peptide', 'Immunology', 'Research Grade'],
    featured: false,
    inStock: true,
    coaUrl: '/coa/NXG-2026-Q2-008.pdf',
    color: '#1568D3',
    image: '/images/products/thymosin-alpha-1.png',
  },
  {
    id: 'follistatin344',
    slug: 'follistatin-344-1mg',
    name: 'Follistatin 344 — 1mg',
    shortName: 'Follistatin 344',
    cas: '188844-34-0',
    category: 'single-peptides',
    categoryLabel: 'Single Peptides',
    purity: '98.5%',
    sizes: [
      { mg: 1, price: 124.99, sku: 'NXG-FST-1MG' },
    ],
    description: 'Follistatin 344 (FST344) is a 344 amino acid isoform of follistatin, a single-chain glycosylated monomeric protein. It functions as a potent binding protein for multiple TGF-β superfamily members in research settings and is used as a tool compound in myogenesis and reproductive biology research.',
    mechanism: 'FST344 demonstrates high-affinity binding to activin A, activin B, myostatin (GDF-8), and BMP-2/4/7 in biochemical assays. Research models utilizing FST344 examine SMAD pathway inhibition and its consequences on satellite cell activation and skeletal muscle progenitor differentiation in vitro.',
    storage: 'Store lyophilized at −80°C. Reconstitute with PBS (pH 7.4) containing 0.1% BSA. Reconstituted: −80°C in aliquots, avoid repeated freeze-thaw.',
    molecularWeight: '31.5 kDa (approximate, glycosylation-dependent)',
    formula: 'C₁₄₃₇H₂₂₅₉N₃₈₃O₄₄₅S₁₄',
    batchNumber: 'NXG-2026-Q2-009',
    testDate: '2026-05-21',
    tags: ['TGF-β Antagonist', 'Glycoprotein', 'Research Grade'],
    featured: false,
    inStock: true,
    coaUrl: '/coa/NXG-2026-Q2-009.pdf',
    color: '#0A3880',
    image: '/images/products/bpc-157.png',
  },
  {
    id: 'wolverine-stack',
    slug: 'wolverine-stack',
    name: 'Wolverine Stack — BPC-157 + TB-500',
    shortName: 'Wolverine Stack',
    cas: 'N/A (Blend)',
    category: 'wolverine-stack',
    categoryLabel: 'Wolverine Stack',
    purity: '99.2%',
    sizes: [
      { mg: 0, price: 99.99, sku: 'NXG-WLV-5MG' },
    ],
    description: 'The Wolverine Stack combines our research-grade BPC-157 (5mg) and TB-500 (5mg) as a curated co-purchase for researchers studying complementary peptide mechanisms. BPC-157 and TB-500 operate through distinct molecular pathways — gastric cytoprotective signaling vs. actin-binding dynamics — making this pairing common in comparative research protocols.',
    mechanism: 'BPC-157 activates the VEGFR2-FAK-paxillin signaling axis in endothelial cell models, while TB-500\'s actin G-monomer binding influences cytoskeletal reorganization in parallel assays. Researchers studying cellular migration, wound healing models, and angiogenesis frequently utilize both compounds in co-treatment experimental designs.',
    storage: 'Each lyophilized vial stored separately at −20°C. Reconstitute individually per standard protocol. Do not pre-mix reconstituted solutions.',
    molecularWeight: 'BPC-157: 1419.55 g/mol | TB-500: 2113.4 g/mol',
    formula: 'Dual-component research kit',
    batchNumber: 'NXG-2026-Q2-010',
    testDate: '2026-05-22',
    tags: ['Research Bundle', 'Dual Peptide', 'Popular'],
    featured: true,
    inStock: true,
    coaUrl: '/coa/NXG-2026-Q2-010.pdf',
    color: '#0F4FA8',
    image: '/images/products/wolverine-stack.png',
  },
  {
    id: 'bac-water',
    slug: 'bacteriostatic-water-30ml',
    name: 'Bacteriostatic Water — 30mL',
    shortName: 'BAC Water 30mL',
    cas: '7732-18-5',
    category: 'reconstitution',
    categoryLabel: 'Reconstitution Supplies',
    purity: 'USP Grade',
    sizes: [
      { mg: 0, price: 9.99, sku: 'NXG-BAC-30ML' },
    ],
    description: 'Sterile bacteriostatic water containing 0.9% benzyl alcohol for the reconstitution of lyophilized peptide research compounds. Manufactured to USP sterility standards. Each vial is sealed with a rubber septum for repeated-access multi-use reconstitution.',
    mechanism: 'Benzyl alcohol (0.9% v/v) functions as a bacteriostatic preservative by disrupting bacterial cell membranes, maintaining sterility in multi-use vials. pH-buffered to 5.0–7.0 for compatibility with lyophilized peptide formulations.',
    storage: 'Store at room temperature (15–25°C). After puncture: refrigerate at 2–8°C, discard after 28 days. Do not freeze.',
    molecularWeight: 'N/A',
    formula: 'H₂O + 0.9% benzyl alcohol',
    batchNumber: 'NXG-2026-Q2-BAC',
    testDate: '2026-05-10',
    tags: ['Reconstitution', 'USP Grade', 'Sterile'],
    featured: false,
    inStock: true,
    coaUrl: '/coa/NXG-2026-Q2-BAC.pdf',
    color: '#C2D8E0',
    image: '/images/products/bpc-157.png',
  },
  {
    id: 'insulin-syringes',
    slug: 'insulin-syringes-29g',
    name: 'Insulin Syringes — 29G × 100ct',
    shortName: '29G Syringes',
    cas: 'N/A',
    category: 'reconstitution',
    categoryLabel: 'Reconstitution Supplies',
    purity: 'Sterile / ISO 10993',
    sizes: [
      { mg: 0, price: 14.99, sku: 'NXG-SYR-29G-100' },
    ],
    description: 'Sterile insulin syringes for laboratory reconstitution and liquid handling of research peptide solutions. 29 gauge × 1/2" needle configuration for precise volume measurement in experimental protocols. 1mL capacity with 0.01mL gradations.',
    mechanism: 'N/A — research equipment',
    storage: 'Store in original sealed packaging at room temperature. Single-use laboratory equipment. Dispose per institutional biohazard waste protocols.',
    molecularWeight: 'N/A',
    formula: 'N/A',
    batchNumber: 'NXG-2026-Q2-SYR',
    testDate: '2026-05-10',
    tags: ['Equipment', 'Sterile', 'Lab Supply'],
    featured: false,
    inStock: true,
    coaUrl: '/coa/NXG-2026-Q2-SYR.pdf',
    color: '#5B6B80',
    image: '/images/products/bpc-157.png',
  },
]

export const CATEGORIES = [
  { id: 'all', label: 'All Products' },
  { id: 'single-peptides', label: 'Single Peptides' },
  { id: 'peptide-blends', label: 'Peptide Blends' },
  { id: 'wolverine-stack', label: 'Wolverine Stack' },
  { id: 'reconstitution', label: 'Reconstitution Supplies' },
]

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find(p => p.slug === slug)
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'all') return PRODUCTS
  return PRODUCTS.filter(p => p.category === category)
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter(p => p.featured)
}

export function getRelatedProducts(product: Product, limit = 3): Product[] {
  return PRODUCTS
    .filter(p => p.id !== product.id && (p.category === product.category || p.featured))
    .slice(0, limit)
}
