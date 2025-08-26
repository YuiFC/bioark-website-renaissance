

import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { featuredProducts, geneEditingProducts, customerSolutions, ShowcaseItem } from '../data/showcase';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';

interface SectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

const SectionWrapper = ({ title, description, children, className }: SectionProps) => (
  <section className={`py-16 lg:py-24 ${className}`}>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-foreground">{title}</h2>
  {/* Force single-line description with truncation if needed */}
  <p className="mt-4 text-lg text-muted-foreground max-w-5xl mx-auto whitespace-nowrap overflow-hidden text-ellipsis">{description}</p>
      </div>
      {children}
    </div>
  </section>
);

const FeaturedProductSlide = ({ item }: { item: ShowcaseItem }) => (
  <Link to={item.link} className="block p-4 rounded-lg transition-colors hover:bg-muted h-full">
    <div className="flex items-center gap-4 h-full">
      <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
      <div>
        <h3 className="font-semibold text-foreground leading-tight">{item.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
      </div>
    </div>
  </Link>
);

const ProductCard = ({ item }: { item: ShowcaseItem }) => (
  <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-[400px] md:h-[420px] lg:h-[460px]">
    <div className="h-full flex flex-col">
      <div className="w-full h-40 md:h-44 lg:h-48 overflow-hidden">
        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      {/* Equal-height body: title (1-2 lines) + description (up to 3 lines) + spacer */}
      <CardContent className="p-6 flex-1 flex flex-col">
        <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2 leading-snug min-h-[3rem]">{item.name}</h3>
        <p className="text-muted-foreground text-sm line-clamp-3 flex-grow">{item.description}</p>
        <div className="mt-4">
          <Button asChild size="sm" variant="default">
            <Link to={item.link}>View the details</Link>
          </Button>
        </div>
      </CardContent>
    </div>
  </Card>
);

const SolutionCard = ({ item }: { item: ShowcaseItem }) => {
  const Icon = item.icon;
  return (
    <Card className="text-center p-8 transition-all duration-300 hover:shadow-xl hover:bg-muted">
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          {Icon && <Icon className="w-8 h-8 text-primary" />}
        </div>
      </div>
      <h3 className="font-semibold text-xl text-foreground mb-3">{item.name}</h3>
      <p className="text-muted-foreground mb-6">{item.description}</p>
      <Button asChild variant="link" className="text-primary">
        <Link to={item.link}>
          Learn More <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </Card>
  );
};

const FeaturedSections = () => {
  // External navigation refs to avoid clipping in overflow-hidden content area
  const featuredPrevRef = useRef<HTMLButtonElement | null>(null);
  const featuredNextRef = useRef<HTMLButtonElement | null>(null);
  return (
    <>
      {/* Featured Products Section */}
      <SectionWrapper
        title="Featured Products"
        description="High-performance reagents designed to accelerate your research and deliver reliable results."
        className="bg-background"
      >
        {/* Wrapper allows arrows to be placed outside while content remains clipped */}
        <div className="relative product-swiper px-20 md:px-24 lg:px-28">
          <div className="overflow-hidden">
            <Swiper
              modules={[Pagination, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              slidesPerGroup={1}
              onInit={(swiper) => {
                if (featuredPrevRef.current && featuredNextRef.current) {
                  // Bind external buttons once DOM is ready
                  // @ts-ignore
                  swiper.params.navigation.prevEl = featuredPrevRef.current;
                  // @ts-ignore
                  swiper.params.navigation.nextEl = featuredNextRef.current;
                  swiper.navigation.init();
                  swiper.navigation.update();
                }
              }}
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 2, slidesPerGroup: 2 },
                1024: { slidesPerView: 3, slidesPerGroup: 3 },
                1280: { slidesPerView: 4, slidesPerGroup: 4 },
              }}
              className="pb-12"
            >
            {featuredProducts.map(item => (
              <SwiperSlide key={item.id} className="h-full pb-2">
                <ProductCard item={item} />
              </SwiperSlide>
            ))}
            </Swiper>
          </div>
          {/* External navigation buttons (not clipped) */}
          <button
            ref={featuredPrevRef}
            aria-label="Previous"
            className="swiper-button-prev"
            type="button"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            ref={featuredNextRef}
            aria-label="Next"
            className="swiper-button-next"
            type="button"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </SectionWrapper>

      {/* Gene Editing Products Section */}
  <SectionWrapper
        title="Gene Editing Products"
        description="A comprehensive portfolio of tools for precise and efficient genome engineering, from CRISPR to viral vectors."
        className="bg-muted/50"
      >
    <div className="relative gene-editing-swiper px-16">
          <div className="overflow-hidden">
            <Swiper
      modules={[Pagination]}
              spaceBetween={30}
              slidesPerView={1}
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 5 },
              }}
              className="pb-12"
            >
            {geneEditingProducts.map(item => (
            <SwiperSlide key={item.id} className="h-full pb-2">
                <ProductCard item={item} />
              </SwiperSlide>
            ))}
            </Swiper>
          </div>
      {/* Arrows removed as requested for Gene Editing carousel */}
        </div>
      </SectionWrapper>

      {/* Customer Solutions Section */}
      <SectionWrapper
        title="Customer Solutions"
        description="Partner with our expert team for tailored services that meet your unique project requirements."
        className="bg-background"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {customerSolutions.map(item => (
            <SolutionCard key={item.id} item={item} />
          ))}
        </div>
      </SectionWrapper>
    </>
  );
};

export default FeaturedSections;
