export type Variation = {
  id: string;
  name: string;
  sku: string | null;
  price_money: {
    amount: number;
    currency: string;
  };
  pricing_type: string;
  image_urls: string[];
  ordinal: number;
  available_for_booking: boolean | null;
}

export type Product = {
  id: string;
  description: string;
  abbreviation: string;
  category_ids: string[];
  image_urls: string[];
  name: string;
  variations: Variation[];
  product_type: string;
  available_online: boolean | null;
  available_for_pickup: boolean | null;
  created_at: string;
  updated_at: string;
}