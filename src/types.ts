// src/types.ts
export interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  stock: number;
  is_active: boolean;
  images: ProductImage[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}