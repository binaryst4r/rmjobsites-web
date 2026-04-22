export interface User {
  id: number;
  email: string;
  given_name?: string;
  family_name?: string;
}

export interface ServiceRequest {
  id: number;
  user_id: number | null;
  customer_name: string;
  customer_email: string;
  company: string;
  service_requested: string;
  pickup_date: string;
  return_date: string;
  dropped_or_impacted: boolean | null;
  needs_replacement_accessories: string | null;
  needs_rental: boolean;
  manufacturer: string;
  model: string;
  serial_number: string;
  turn_around_time: string;
  after_hours_dropoff: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
  assigned_user: User | null;
}

export interface ServiceRequestFormData {
  customer_name: string;
  customer_email: string;
  company: string;
  service_requested: string;
  pickup_date: string;
  return_date: string;
  turn_around_time: string;
  after_hours_dropoff: boolean;
  dropped_or_impacted: boolean | null;
  needs_replacement_accessories: string | null;
  needs_rental: boolean;
  manufacturer: string;
  model: string;
  serial_number: string;
  notes: string;
}

export interface ServiceRequestResponse {
  service_request: ServiceRequest;
  message: string;
}
