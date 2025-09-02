import React, { useMemo, useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { addQuote } from '@/lib/quotes';
import { Check, ChevronLeft, ChevronRight, Dna, Package, Search, Tags, Workflow } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

type Category = 'CRISPR-Cas9' | 'RNAi' | 'Mammalian Cloning' | 'Prokaryotic Cloning';
type FunctionType =
  | 'CRISPR RNA Knockdown' | 'CRISPRa' | 'CRISPRi' | 'CRISPR KnockOut' | 'CRISPR AAVS1 Donor'
  | 'shRNA' | 'siRNA' | 'Overexpression' | 'Knock-In' | 'Knock-Out';
type DeliveryType = 'Standard' | 'All-in-One' | 'Lenti' | 'Lenti-AIO' | 'Plasmid' | 'AAV';

type StructureSelections = {
  promoter?: 'PCMV' | 'EF1a' | 'EF1a Core';
  proteinTag?: 'His' | 'MycDDK' | 'None' | 'Customized';
  fluorescence?: 'GFP' | 'RFP' | 'BFP' | 'Luciferase' | 'None';
  selection?: 'Puro' | 'BSD' | 'Neo' | 'None';
};

type TargetChoice = 'Search Target Gene' | 'Control (or Scramble)' | 'Non-Insert (or Template)';

const CATEGORY_DESC: Record<Category, string> = {
  'CRISPR-Cas9': 'Genome editing using CRISPR-Cas systems with flexible payloads and strategies.',
  RNAi: 'Gene silencing via RNA interference, supporting shRNA/siRNA designs.',
  'Mammalian Cloning': 'Mammalian expression vectors for overexpression, KO/KI strategies.',
  'Prokaryotic Cloning': 'Bacterial cloning and expression with robust promoters and markers.',
};

const FUNCTION_BY_CATEGORY: Record<Category, FunctionType[]> = {
  'CRISPR-Cas9': ['CRISPR RNA Knockdown', 'CRISPRa', 'CRISPRi', 'CRISPR KnockOut', 'CRISPR AAVS1 Donor'],
  RNAi: ['shRNA', 'siRNA'],
  'Mammalian Cloning': ['Overexpression', 'Knock-In', 'Knock-Out'],
  'Prokaryotic Cloning': ['Overexpression', 'Knock-Out'],
};

const FUNCTION_DESC: Record<FunctionType, string> = {
  'CRISPR RNA Knockdown': 'RNA-guided knockdown using Cas effectors and RNA modules.',
  CRISPRa: 'CRISPR activation to upregulate gene expression without cutting DNA.',
  CRISPRi: 'CRISPR interference to repress transcription in a programmable way.',
  'CRISPR KnockOut': 'Create frameshift mutations and loss-of-function via indels.',
  'CRISPR AAVS1 Donor': 'Safe-harbor AAVS1 donor for targeted integration.',
  shRNA: 'Short hairpin RNA construct for stable gene silencing.',
  siRNA: 'Synthetic siRNA design for transient knockdown.',
  Overexpression: 'Express open reading frames under strong promoters.',
  'Knock-In': 'Targeted insertion using HDR or donor templates.',
  'Knock-Out': 'Generate gene KO using CRISPR or recombineering.',
};

const DELIVERY_BY_FUNCTION: Record<FunctionType, DeliveryType[]> = {
  'CRISPR RNA Knockdown': ['Standard', 'All-in-One', 'Lenti', 'Lenti-AIO'],
  CRISPRa: ['Standard', 'All-in-One', 'Lenti', 'Lenti-AIO'],
  CRISPRi: ['Standard', 'All-in-One', 'Lenti', 'Lenti-AIO'],
  'CRISPR KnockOut': ['Standard', 'All-in-One', 'Lenti', 'Lenti-AIO', 'AAV'],
  'CRISPR AAVS1 Donor': ['Plasmid', 'AAV'],
  shRNA: ['Plasmid', 'Lenti'],
  siRNA: ['Plasmid'],
  Overexpression: ['Plasmid', 'Lenti', 'AAV'],
  'Knock-In': ['Plasmid', 'AAV'],
  'Knock-Out': ['Plasmid', 'Lenti'],
};

const DELIVERY_DESC: Record<DeliveryType, string> = {
  Standard: 'Separate components in modular vectors.',
  'All-in-One': 'Single vector carrying all required elements.',
  Lenti: 'Lentiviral-compatible vector system.',
  'Lenti-AIO': 'Lentiviral all-in-one configuration.',
  Plasmid: 'Standard plasmid-based delivery.',
  AAV: 'Adeno-associated viral vector packaging compatible.',
};

const PROMOTERS: StructureSelections['promoter'][] = ['PCMV', 'EF1a', 'EF1a Core'];
const TAGS: StructureSelections['proteinTag'][] = ['His', 'MycDDK', 'None', 'Customized'];
const FLUO: StructureSelections['fluorescence'][] = ['GFP', 'RFP', 'BFP', 'Luciferase', 'None'];
const SELECTION: StructureSelections['selection'][] = ['Puro', 'BSD', 'Neo', 'None'];

const TARGET_CHOICES: TargetChoice[] = ['Search Target Gene', 'Control (or Scramble)', 'Non-Insert (or Template)'];

const StepBadge = ({ index, title, active, done }: { index: number; title: string; active?: boolean; done?: boolean }) => (
  <div className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-all ${active ? 'border-primary bg-primary/5 shadow-sm' : 'border-border'} ${done ? 'opacity-80' : ''}`}>
    <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${active ? 'bg-primary text-primary-foreground scale-105' : 'bg-muted text-foreground'} ${done ? 'bg-primary text-primary-foreground' : ''}`}>
      {done ? <Check className="h-4 w-4" /> : index}
    </div>
    <div className={`text-sm transition-colors ${active ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{title}</div>
  </div>
);

const OptionButton = ({
  label,
  selected,
  onClick,
  icon: Icon,
}: {
  label: string;
  selected?: boolean;
  onClick: () => void;
  icon?: React.ComponentType<any>;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`relative flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${selected ? 'border-primary bg-primary/5 text-foreground ring-1 ring-primary/30 shadow-sm scale-[1.01]' : 'border-border hover:border-primary/50 text-foreground hover:shadow-sm hover:scale-[1.01]'}`}
  >
    {Icon ? <Icon className="h-4 w-4 text-primary" /> : null}
    <span className="text-sm font-medium">{label}</span>
  </button>
);

export default function Design() {
  const { addItem } = useCart();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [category, setCategory] = useState<Category | undefined>();
  const [funcType, setFuncType] = useState<FunctionType | undefined>();
  const [delivery, setDelivery] = useState<DeliveryType | undefined>();
  const [structure, setStructure] = useState<StructureSelections>({});
  const [targetChoice, setTargetChoice] = useState<TargetChoice | undefined>();
  const [geneName, setGeneName] = useState('');
  const [geneSpecies, setGeneSpecies] = useState('');
  const [geneSubmitted, setGeneSubmitted] = useState(false);

  const canNext = useMemo(() => {
    if (step === 1) return !!category;
    if (step === 2) return !!funcType;
    if (step === 3) return !!delivery;
  if (step === 4) return !!structure.promoter && !!structure.selection; // Required example: promoter and selection marker
    if (step === 5) {
      if (targetChoice === 'Search Target Gene') return geneSubmitted; // only after user submits
      return !!targetChoice;
    }
    return false;
  }, [step, category, funcType, delivery, structure, targetChoice, geneSubmitted]);

  const canAddToCart = useMemo(() => step === 5 && canNext, [step, canNext]);

  // Pricing policy for Gene Design
  // Pricing hidden per request
  const originalPrice = 0;
  const limitedPrice = 0;

  const summary = useMemo(() => {
    let target = '';
    if (targetChoice === 'Search Target Gene') {
      if (geneSubmitted && geneName.trim() && geneSpecies.trim()) {
        target = `${geneName.trim()} [${geneSpecies.trim()}]`;
      }
    } else {
      target = targetChoice || '';
    }
    return { category, funcType, delivery, ...structure, target } as const;
  }, [category, funcType, delivery, structure, targetChoice, geneName, geneSpecies, geneSubmitted]);

  const productName = useMemo(() => {
    const parts = [category, funcType, delivery].filter(Boolean).join(' • ');
    return parts || 'Custom Gene Design';
  }, [category, funcType, delivery]);

  const productVariant = useMemo(() => {
    const s: string[] = [];
    if (structure.promoter) s.push(`Promoter:${structure.promoter}`);
    if (structure.proteinTag) s.push(`Tag:${structure.proteinTag}`);
    if (structure.fluorescence) s.push(`Fluo:${structure.fluorescence}`);
    if (structure.selection) s.push(`Select:${structure.selection}`);
    if (summary.target) s.push(`Target:${summary.target}`);
    return s.join(' | ');
  }, [structure, summary]);

  // Quote dialog state
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');

  const submitDesignQuote = () => {
    const [firstName, ...rest] = custName.trim().split(/\s+/);
    const lastName = rest.join(' ');
    const payload = {
      firstName: firstName || '-',
      lastName: lastName || '-',
      email: custEmail.trim(),
      phone: '',
      company: 'Design Page',
      department: '',
      serviceType: 'Custom Design',
      timeline: '',
      budget: '',
      projectDescription: `${productName} | ${productVariant}`,
      additionalInfo: JSON.stringify({ summary }),
      // No site-wide login: do not attach user snapshot
    } as const;
    addQuote(payload as any);
    setQuoteOpen(false);
    setCustName('');
    setCustEmail('');
    toast({ title: 'Quote submitted', description: 'We will contact you soon.' });
  };

  // Legend overlay config for on-image markers
  // Legend overlay removed per request

  const resetAfter = (toStep: number) => {
  if (toStep <= 1) { setFuncType(undefined); setDelivery(undefined); setStructure({}); setTargetChoice(undefined); setGeneName(''); setGeneSpecies(''); setGeneSubmitted(false); }
  else if (toStep <= 2) { setDelivery(undefined); setStructure({}); setTargetChoice(undefined); setGeneName(''); setGeneSpecies(''); setGeneSubmitted(false); }
  else if (toStep <= 3) { setStructure({}); setTargetChoice(undefined); setGeneName(''); setGeneSpecies(''); setGeneSubmitted(false); }
  else if (toStep <= 4) { setTargetChoice(undefined); setGeneName(''); setGeneSpecies(''); setGeneSubmitted(false); }
    setStep(toStep);
  };

  const goNext = () => { if (canNext) setStep((s) => Math.min(5, s + 1)); };
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  const currentFunctions = category ? FUNCTION_BY_CATEGORY[category] : [];
  const currentDeliveries = funcType ? DELIVERY_BY_FUNCTION[funcType] : [];

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Step indicator */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            <StepBadge index={1} title="Select category" active={step === 1} done={step > 1} />
            <StepBadge index={2} title="Select function type" active={step === 2} done={step > 2} />
            <StepBadge index={3} title="Select delivery type" active={step === 3} done={step > 3} />
            <StepBadge index={4} title="Select structure map" active={step === 4} done={step > 4} />
            <StepBadge index={5} title="Select target gene" active={step === 5} />
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${((step - 1) / 4) * 100}%` }}
            />
          </div>
        </div>

        <section className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visualization */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Dna className="h-5 w-5 text-primary" /> Gene Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative rounded-xl overflow-hidden border bg-card">
                  <img src="/images/products/Lego-Diagram-0.png" alt="Gene structure" className="w-full h-[300px] md:h-[420px] object-contain bg-white" />
                  {/* Legend overlay removed */}
                  {/* Overlay chips to reflect current selections */}
                  <div className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2">
                    {category && <span className="px-2 py-1 text-xs rounded-md bg-primary/10 text-foreground border border-primary/20 animate-in fade-in-50 slide-in-from-bottom-1">{category}</span>}
                    {funcType && <span className="px-2 py-1 text-xs rounded-md bg-secondary/10 text-foreground border border-secondary/30 animate-in fade-in-50 slide-in-from-bottom-1">{funcType}</span>}
                    {delivery && <span className="px-2 py-1 text-xs rounded-md bg-accent/10 text-foreground border border-accent/30 animate-in fade-in-50 slide-in-from-bottom-1">{delivery}</span>}
                    {structure.promoter && <span className="px-2 py-1 text-xs rounded-md bg-muted text-foreground border animate-in fade-in-50 slide-in-from-bottom-1">Promoter: {structure.promoter}</span>}
                    {structure.proteinTag && <span className="px-2 py-1 text-xs rounded-md bg-muted text-foreground border animate-in fade-in-50 slide-in-from-bottom-1">Tag: {structure.proteinTag}</span>}
                    {structure.fluorescence && <span className="px-2 py-1 text-xs rounded-md bg-muted text-foreground border animate-in fade-in-50 slide-in-from-bottom-1">Fluo: {structure.fluorescence}</span>}
                    {structure.selection && <span className="px-2 py-1 text-xs rounded-md bg-muted text-foreground border animate-in fade-in-50 slide-in-from-bottom-1">Select: {structure.selection}</span>}
                    {summary.target && <span className="px-2 py-1 text-xs rounded-md bg-enzyme/10 text-foreground border border-enzyme/30 animate-in fade-in-50 slide-in-from-bottom-1">Target: {summary.target}</span>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Info Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Tags className="h-5 w-5 text-primary" /> Design Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Category</div>
                    <div className="font-medium">{category || '-'}</div>
                    {category && <p className="text-xs text-muted-foreground mt-1">{CATEGORY_DESC[category]}</p>}
                  </div>
                  <div>
                    <div className="text-muted-foreground">Function Type</div>
                    <div className="font-medium">{funcType || '-'}</div>
                    {funcType && <p className="text-xs text-muted-foreground mt-1">{FUNCTION_DESC[funcType]}</p>}
                  </div>
                  <div>
                    <div className="text-muted-foreground">Delivery Type</div>
                    <div className="font-medium">{delivery || '-'}</div>
                    {delivery && <p className="text-xs text-muted-foreground mt-1">{DELIVERY_DESC[delivery]}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-muted-foreground">Promoter</div>
                      <div className="font-medium">{structure.promoter || '-'}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Protein Tag</div>
                      <div className="font-medium">{structure.proteinTag || '-'}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Fluorescence Marker</div>
                      <div className="font-medium">{structure.fluorescence || '-'}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Selection Marker</div>
                      <div className="font-medium">{structure.selection || '-'}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Target Sequence</div>
                    <div className="font-medium">{summary.target || '-'}</div>
                  </div>
                </div>

                {canAddToCart && (
                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2">
                    {/* Price section removed per request */}
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button onClick={() => setQuoteOpen(true)} className="w-full sm:w-auto whitespace-nowrap">
                        Add to Quote
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Step Content / Option Buttons */}
        <section className="pb-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Workflow className="h-5 w-5 text-primary" />
                  {step === 1 && 'Step 1 · Select category'}
                  {step === 2 && 'Step 2 · Select function type'}
                  {step === 3 && 'Step 3 · Select delivery type'}
                  {step === 4 && 'Step 4 · Select structure map'}
                  {step === 5 && 'Step 5 · Provide target gene info'}
                </CardTitle>
              </CardHeader>
              <CardContent key={step} className="animate-in fade-in-50 slide-in-from-bottom-2">
                {step === 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {(Object.keys(CATEGORY_DESC) as Category[]).map((c) => (
                      <OptionButton key={c} label={c} selected={category === c} onClick={() => { setCategory(c); resetAfter(2); }} icon={Package} />
                    ))}
                  </div>
                )}

                {step === 2 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {currentFunctions.map((f) => (
                      <OptionButton key={f} label={f} selected={funcType === f} onClick={() => { setFuncType(f); resetAfter(3); }} icon={Tags} />
                    ))}
                  </div>
                )}

                {step === 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {currentDeliveries.map((d) => (
                      <OptionButton key={d} label={d} selected={delivery === d} onClick={() => { setDelivery(d); resetAfter(4); }} icon={Package} />
                    ))}
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <div>
                      <div className="mb-2 text-sm text-muted-foreground">Promoter</div>
                      <div className="flex flex-wrap gap-2">
                        {PROMOTERS.map((p) => (
                          <OptionButton key={p} label={p} selected={structure.promoter === p} onClick={() => setStructure((s) => ({ ...s, promoter: p }))} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 text-sm text-muted-foreground">Protein Tag</div>
                      <div className="flex flex-wrap gap-2">
                        {TAGS.map((t) => (
                          <OptionButton key={t} label={t} selected={structure.proteinTag === t} onClick={() => setStructure((s) => ({ ...s, proteinTag: t }))} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 text-sm text-muted-foreground">Fluorescence Marker</div>
                      <div className="flex flex-wrap gap-2">
                        {FLUO.map((f) => (
                          <OptionButton key={f} label={f} selected={structure.fluorescence === f} onClick={() => setStructure((s) => ({ ...s, fluorescence: f }))} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 text-sm text-muted-foreground">Selection Marker</div>
                      <div className="flex flex-wrap gap-2">
                        {SELECTION.map((m) => (
                          <OptionButton key={m} label={m} selected={structure.selection === m} onClick={() => setStructure((s) => ({ ...s, selection: m }))} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap gap-2">
                      {TARGET_CHOICES.map((t) => (
                        <OptionButton key={t} label={t} selected={targetChoice === t} onClick={() => { setTargetChoice(t); if (t !== 'Search Target Gene') { setGeneSubmitted(true); } }} icon={t === 'Search Target Gene' ? Search : undefined} />
                      ))}
                    </div>
                    {targetChoice === 'Search Target Gene' && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Gene Name</div>
                            <Input
                              placeholder="e.g., TP53"
                              value={geneName}
                              onChange={(e) => { setGeneName(e.target.value); setGeneSubmitted(false); }}
                            />
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">Gene Species</div>
                            <Input
                              placeholder="e.g., Homo sapiens"
                              value={geneSpecies}
                              onChange={(e) => { setGeneSpecies(e.target.value); setGeneSubmitted(false); }}
                            />
                          </div>
                        </div>
                        <div className="pt-1">
                          <Button
                            onClick={() => {
                              const name = geneName.trim();
                              const sp = geneSpecies.trim();
                              if (!name || !sp) {
                                toast({ title: 'Please complete gene info', description: 'Enter both Gene Name and Gene Species.' });
                                setGeneSubmitted(false);
                                return;
                              }
                              setGeneSubmitted(true);
                            }}
                          >
                            Submit
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between">
                  <Button variant="ghost" onClick={goBack} disabled={step === 1} className="transition-transform hover:-translate-x-0.5">
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back
                  </Button>
                  <div className="flex items-center gap-2">
                    {step < 5 ? (
                      <Button onClick={goNext} disabled={!canNext} className={`transition-transform ${canNext ? 'hover:translate-x-0.5' : ''}`}>
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    ) : canAddToCart ? (
                      <Button onClick={() => setQuoteOpen(true)}>
                        Add to Quote
                      </Button>
                    ) : (
                      <Button disabled title="Complete all selections to proceed">
                        Complete selections
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>

      {/* Quote Dialog */}
      <Dialog open={quoteOpen} onOpenChange={setQuoteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Quote</DialogTitle>
            <DialogDescription>Fill in your contact so we can follow up with your design.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Customer name</div>
              <Input value={custName} onChange={(e)=>setCustName(e.target.value)} placeholder="Your name" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">Leave your email</div>
              <Input type="email" value={custEmail} onChange={(e)=>setCustEmail(e.target.value)} placeholder="you@example.com" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={submitDesignQuote} disabled={!custEmail.trim() || !custName.trim()}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
