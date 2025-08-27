
import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProductDetailProps {
  title: string;
  category: string;
  catalogNumber: string;
  availability: string;
  listPrice: string;
  options: string[];
  description: string;
  keyFeatures: string[];
  storageStability: string;
  performanceData: string;
  manuals: string[];
  mainImage: string;
  storeLink?: string;
}

const ProductDetailTemplate: React.FC<ProductDetailProps> = ({
  title,
  category,
  catalogNumber,
  availability,
  listPrice,
  options,
  description,
  keyFeatures,
  storageStability,
  performanceData,
  manuals,
  mainImage,
  storeLink
}) => {
  return (
    <Layout>
      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <section className="py-8 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="text-sm text-muted-foreground">
              <a href="/" className="hover:text-primary">Home</a>
              <span className="mx-2">/</span>
              <a href="/products" className="hover:text-primary">Products</a>
              <span className="mx-2">/</span>
              <span className="text-foreground">{title}</span>
            </nav>
          </div>
        </section>

        {/* Product Header */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Product Images */}
              <div>
                {/* Main Product Image */}
                <div className="w-full h-96 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                  <img 
                    src={mainImage} 
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Additional Images */}
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="aspect-square bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center">
                      <div className="text-center text-muted-foreground/50">
                        <div className="w-6 h-6 mx-auto mb-1 rounded border border-dashed border-current flex items-center justify-center">
                          <span className="text-xs">G</span>
                        </div>
                        <p className="text-xs">Graph</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div>
                <Badge className="mb-4">{category}</Badge>
                <h1 className="text-3xl font-bold text-foreground mb-4">{title}</h1>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-4">
                    <span className="font-medium text-foreground">Catalog #:</span>
                    <span className="text-muted-foreground">{catalogNumber}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-medium text-foreground">Availability:</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {availability}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="font-medium text-foreground">List Price:</span>
                    <span className="text-2xl font-bold text-primary">{listPrice}</span>
                  </div>
                </div>

                {/* Options */}
                {options.length > 0 && (
                  <div className="mb-8">
                    <h3 className="font-semibold text-foreground mb-3">Available Options:</h3>
                    <div className="space-y-2">
                      {options.map((option, index) => (
                        <label key={index} className="flex items-center space-x-3 cursor-pointer">
                          <input type="radio" name="option" className="text-primary" defaultChecked={index === 0} />
                          <span className="text-muted-foreground">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Button className="bioark-gradient text-white hover:opacity-90 transition-opacity">
                    <a href="/request-quote">Request Quote</a>
                  </Button>
                  {storeLink ? (
                    <Button asChild className="bg-primary text-white hover:bg-primary/90">
                      <a href={storeLink} target="_blank" rel="noopener noreferrer">
                        Add to Cart
                      </a>
                    </Button>
                  ) : (
                    <Button asChild className="bg-primary text-white hover:bg-primary/90">
                      <a href="https://store.bioarktech.com/cart" target="_blank" rel="noopener noreferrer">
                        Add to Cart
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Details */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Description & Features */}
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {description}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Key Features</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {keyFeatures.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-2 flex-shrink-0" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Technical Info */}
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Storage & Stability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {storageStability}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Data</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {performanceData}
                    </p>
                    {/* Performance Data Image Placeholder */}
                    <div className="w-full h-48 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center">
                      <div className="text-center text-muted-foreground/70">
                        <div className="w-16 h-16 mx-auto mb-2 rounded border-2 border-dashed border-current flex items-center justify-center">
                          <span className="text-sm">CHART</span>
                        </div>
                        <p className="text-sm">Performance Data Chart</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Manuals & Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {manuals.map((manual, index) => (
                        <li key={index}>
                          <a href="#" className="text-primary hover:underline flex items-center">
                            <span className="mr-2">📄</span>
                            {manual}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default ProductDetailTemplate;
