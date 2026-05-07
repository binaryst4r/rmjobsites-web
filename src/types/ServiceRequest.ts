export interface User {
  id: number;
  email: string;
  given_name?: string;
  family_name?: string;
}

export type TrinaryStatus = 'NO' | 'YES' | 'DONT_KNOW';
export type RentalStatus = 'NO' | 'YES';

export interface ServiceRequest {
  id: number;
  user_id: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  company: string;
  service_requested: string;
  pickup_date: string | null;
  dropoff_time: string | null;
  damage_status: TrinaryStatus | null;
  replacement_status: TrinaryStatus | null;
  replacement_parts: string[];
  rental_status: RentalStatus | null;
  rental_during_service_type: string | null;
  dropped_or_impacted: boolean | null;
  needs_replacement_accessories: string | null;
  needs_rental: boolean | null;
  manufacturer: string | null;
  model: string | null;
  serial_number: string | null;
  turn_around_time: string | null;
  after_hours_dropoff: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  assigned_user: User | null;
}

export interface ServiceRequestFormData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  company: string;
  service_requested: string;
  pickup_date: string;
  dropoff_time: string;
  after_hours_dropoff: boolean;
  turn_around_time: string;
  damage_status: TrinaryStatus | '';
  replacement_status: TrinaryStatus | '';
  replacement_parts: string[];
  rental_status: RentalStatus | '';
  rental_during_service_type: string;
  notes: string;
}

export interface ServiceRequestResponse {
  service_request: ServiceRequest;
  message: string;
}
