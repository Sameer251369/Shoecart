import { CameraOff } from 'lucide-react'
import { ProductCard, type Product } from './ProductCard' // Use 'type' keyword to be safe

interface ProductGridProps {
  isLoading: boolean
  products: Product[]
  onAddToCart: (product: Product) => void
  onSelectProduct?: (product: Product) => void 
}

export const ProductGrid = ({ isLoading, products, onAddToCart, onSelectProduct }: ProductGridProps) => {
  if (isLoading) return <div className="py-20 text-center uppercase tracking-widest text-xs font-bold animate-pulse">Loading...</div>

  if (!products?.length) {
    return (
      <div className="py-40 flex flex-col items-center text-zinc-400">
        <CameraOff className="mb-4 w-10 h-10 stroke-[1px]" />
        <p className="uppercase tracking-widest text-[10px] font-bold">No products found</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onOpenDetail={onSelectProduct ? () => onSelectProduct(product) : undefined}
        />
      ))}
    </div>
  )
}