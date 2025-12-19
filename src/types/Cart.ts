export interface CartItem {
  productId: string;
  variationId: string;
  productName: string;
  variationName: string;
  price: number; // in cents
  quantity: number;
  imageUrl: string;
}

export interface OrderLineItem {
  catalog_object_id: string;
  quantity: string;
}

export interface OrderCalculation {
  subtotal: number;
  taxes: number;
  shipping: number;
  total: number;
  line_items: Array<{
    catalog_object_id: string;
    quantity: string;
    name: string;
    total_money: {
      amount: number;
      currency: string;
    };
  }>;
}

export interface CreateOrderRequest {
  line_items: OrderLineItem[];
  customer_id?: number;
}

export interface CreateOrderResponse {
  order: {
    id: string;
    location_id: string;
    line_items: any[];
    total_money: {
      amount: number;
      currency: string;
    };
    created_at: string;
  };
}
