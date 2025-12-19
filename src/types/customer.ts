export interface Address {
  address_line_1?: string;
  address_line_2?: string;
  locality?: string;
  administrative_district_level_1?: string;
  postal_code?: string;
  country?: string;
}

export interface Customer {
  id: string;
  created_at?: string;
  updated_at?: string;
  given_name?: string;
  family_name?: string;
  email_address?: string;
  phone_number?: string;
  address?: Address;
}

export interface Card {
  id: string;
  card_brand?: string;
  last_4?: string;
  exp_month?: number;
  exp_year?: number;
  cardholder_name?: string;
  billing_address?: Address;
  enabled?: boolean;
}

export interface LineItem {
  uid?: string;
  catalog_object_id?: string;
  name?: string;
  quantity?: string;
  base_price_money?: {
    amount?: number;
    currency?: string;
  };
  total_money?: {
    amount?: number;
    currency?: string;
  };
  variation_name?: string;
}

export interface Order {
  id: string;
  location_id?: string;
  created_at?: string;
  updated_at?: string;
  state?: string;
  total_money?: {
    amount?: number;
    currency?: string;
  };
  total_tax_money?: {
    amount?: number;
    currency?: string;
  };
  total_discount_money?: {
    amount?: number;
    currency?: string;
  };
  line_items?: LineItem[];
  customer_id?: string;
}

export interface UpdateCustomerData {
  given_name?: string;
  family_name?: string;
  email?: string;
  phone_number?: string;
  address?: Address;
}
