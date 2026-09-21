export interface CreateProductRequest {
  code: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
}

export interface UpdateProductRequest {
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
}
