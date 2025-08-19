

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '/src/components/ui/button';
import { Card, CardContent } from '/src/components/ui/card';
import { featuredProducts, geneEditingProducts, customerSolutions, ShowcaseItem } from '/src/data/showcase';
import { ArrowRight } from 'lucide-react';
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
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">{description}</p>
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
  <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
    <Link to={item.link} className="block h-full flex flex-col">
      <div className="aspect-w-16 aspect-h-9 overflow-hidden">
        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <CardContent className="p-6 flex-grow flex flex-col">
        <h3 className="font-semibold text-lg text-foreground mb-2">{item.name}</h3>
        <p className="text-muted-foreground text-sm flex-grow">{item.description}</p>
      </CardContent>
    </Link>
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
  return (
    <>
      {/* Featured Products (Reagents) Section */}
      <SectionWrapper
        title="Featured Products (Reagents)"
        description="High-performance reagents designed to accelerate your research and deliver reliable results."
        className="bg-background"
      >
        <div className="relative px-16">
          <Swiper
            modules={[Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={2}
            slidesPerGroup={2}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              768: { slidesPerView: 3, slidesPerGroup: 3 },
              1024: { slidesPerView: 4, slidesPerGroup: 4 },
              1280: { slidesPerView: 5, slidesPerGroup: 5 },
            }}
            className="pb-12 product-swiper"
          >
            {featuredProducts.map(item => (
              <SwiperSlide key={item.id} className="h-full pb-2">
                <ProductCard item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </SectionWrapper>

      {/* Gene Editing Products Section */}
      <SectionWrapper
        title="Gene Editing Products"
        description="A comprehensive portfolio of tools for precise and efficient genome engineering, from CRISPR to viral vectors."
        className="bg-muted/50"
      >
        <div className="relative px-16">
          <Swiper
            modules={[Pagination, Navigation]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1280: { slidesPerView: 5 },
            }}
            className="pb-12 gene-editing-swiper"
          >
            {geneEditingProducts.map(item => (
            <SwiperSlide key={item.id} className="h-full pb-2">
                <ProductCard item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
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
