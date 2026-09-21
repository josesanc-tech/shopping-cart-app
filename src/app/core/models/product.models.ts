export interface Product {
  id: number;
  code: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
}

export interface ProductFilters {
  search?: string;
  category?: string;
}
