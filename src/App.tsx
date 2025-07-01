
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Services from "./pages/Services";
import RequestQuote from "./pages/RequestQuote";
import Investors from "./pages/Investors";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

// Individual Product Pages
import FastSybrGreenQpcrMasterMix from "./pages/products/FastSybrGreenQpcrMasterMix";
import SybrGreenQpcrMasterMix from "./pages/products/SybrGreenQpcrMasterMix";
import WesternProteinMarkerI from "./pages/products/WesternProteinMarkerI";
import BaPolyTransfectionReagent from "./pages/products/BaPolyTransfectionReagent";
import TargetedKnockIn from "./pages/products/TargetedKnockIn";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:productId" element={<ProductDetail />} />
          
          {/* Individual Product Detail Pages */}
          <Route path="/products/2-fast-sybr-green-qpcr-master-mix" element={<FastSybrGreenQpcrMasterMix />} />
          <Route path="/products/2-sybr-green-qpcr-master-mix" element={<SybrGreenQpcrMasterMix />} />
          <Route path="/products/western-protein-marker-i-exposure" element={<WesternProteinMarkerI />} />
          <Route path="/products/bapoly-in-vitro-dna-transfection-reagent" element={<BaPolyTransfectionReagent />} />
          <Route path="/products/targeted-knock-in" element={<TargetedKnockIn />} />
          
          <Route path="/services" element={<Services />} />
          <Route path="/request-quote" element={<RequestQuote />} />
          <Route path="/investors" element={<Investors />} />
          <Route path="/contact" element={<Contact />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
