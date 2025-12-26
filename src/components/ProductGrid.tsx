import React from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from './ProductCard';



interface ProductGridProps {
  products: Product[];
  isLoading: boolean;
  onAddToCart: (product: Product) => void;
}

export const ProductGrid = ({ products, isLoading, onAddToCart }: ProductGridProps) => {

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-zinc-900"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-2">
      {products.length > 0 ? (
        products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            onAddToCart={onAddToCart} 
          />
        ))
      ) : (
        <div className="col-span-full text-center py-20 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200">
          <p className="text-zinc-500 font-medium italic">The collection is currently empty.</p>
          <p className="text-xs text-zinc-400 mt-1">Check back soon for new arrivals.</p>
        </div>
      )}
    </div>
  );
};